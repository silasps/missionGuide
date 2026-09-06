-- ============================================================
-- Notificações de "conquista" pro parceiro: sua oração pessoal foi
-- respondida, um ponto de oração do projeto foi concluído, ou o projeto
-- que ele apoia foi marcado como concluído. Tipos já existiam mapeados
-- no frontend (notifications-bell.tsx / mark-read), mas nunca disparavam
-- de fato — feedback direto do usuário testando o dashboard do parceiro.
-- ============================================================

-- Pedido de oração pessoal respondido -> notifica quem pediu
CREATE OR REPLACE FUNCTION trg_fn_notify_prayer_answered()
RETURNS TRIGGER AS $$
DECLARE
  v_display_name text;
BEGIN
  IF NEW.is_answered = true AND OLD.is_answered = false THEN
    SELECT display_name INTO v_display_name FROM profiles WHERE id = NEW.profile_id;
    PERFORM notify(NEW.requester_id, 'prayer_answered', jsonb_build_object(
      'prayer_request_id', NEW.id, 'profile_id', NEW.profile_id, 'highlight_id', NEW.highlight_id,
      'display_name', v_display_name
    ));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notify_prayer_answered
  AFTER UPDATE ON prayer_requests
  FOR EACH ROW EXECUTE FUNCTION trg_fn_notify_prayer_answered();

-- Ponto de oração de um projeto concluído -> notifica quem ora por ele
-- (pedidos de oração ligados ao ponto ou ao projeto) e quem apoia
-- financeiramente o projeto (pledge confirmado ou assinatura ativa).
CREATE OR REPLACE FUNCTION trg_fn_notify_prayer_point_completed()
RETURNS TRIGGER AS $$
DECLARE
  v_title text;
  v_slug text;
  v_username text;
  v_user RECORD;
BEGIN
  IF NEW.is_completed = true AND OLD.is_completed = false THEN
    SELECT h.title, h.slug, p.username INTO v_title, v_slug, v_username
      FROM highlights h JOIN profiles p ON p.id = h.profile_id WHERE h.id = NEW.highlight_id;

    FOR v_user IN
      SELECT DISTINCT requester_id AS user_id FROM prayer_requests
        WHERE (prayer_point_id = NEW.id OR highlight_id = NEW.highlight_id) AND requester_id IS NOT NULL
      UNION
      SELECT DISTINCT reporter_user_id AS user_id FROM pledges
        WHERE highlight_id = NEW.highlight_id AND status = 'confirmed' AND reporter_user_id IS NOT NULL
      UNION
      SELECT DISTINCT reporter_user_id AS user_id FROM recurring_pledges
        WHERE highlight_id = NEW.highlight_id AND status = 'active' AND reporter_user_id IS NOT NULL
    LOOP
      PERFORM notify(v_user.user_id, 'prayer_point_completed', jsonb_build_object(
        'prayer_point_id', NEW.id, 'highlight_id', NEW.highlight_id, 'title', NEW.title,
        'highlight_title', v_title, 'slug', v_slug, 'username', v_username
      ));
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notify_prayer_point_completed
  AFTER UPDATE ON project_prayer_points
  FOR EACH ROW EXECUTE FUNCTION trg_fn_notify_prayer_point_completed();

-- Projeto marcado como concluído -> notifica quem apoia financeiramente
CREATE OR REPLACE FUNCTION trg_fn_notify_project_completed()
RETURNS TRIGGER AS $$
DECLARE
  v_username text;
  v_user RECORD;
BEGIN
  IF NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed' THEN
    SELECT username INTO v_username FROM profiles WHERE id = NEW.profile_id;

    FOR v_user IN
      SELECT DISTINCT reporter_user_id AS user_id FROM pledges
        WHERE highlight_id = NEW.id AND status = 'confirmed' AND reporter_user_id IS NOT NULL
      UNION
      SELECT DISTINCT reporter_user_id AS user_id FROM recurring_pledges
        WHERE highlight_id = NEW.id AND status = 'active' AND reporter_user_id IS NOT NULL
    LOOP
      PERFORM notify(v_user.user_id, 'project_completed', jsonb_build_object(
        'highlight_id', NEW.id, 'title', NEW.title, 'slug', NEW.slug, 'username', v_username
      ));
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notify_project_completed
  AFTER UPDATE ON highlights
  FOR EACH ROW EXECUTE FUNCTION trg_fn_notify_project_completed();
