-- Link de convite de grupo do WhatsApp (chat.whatsapp.com/...) — não
-- depende da API do WhatsApp Business (que o app não integra ainda), é só
-- um link que qualquer visitante clica pra entrar. Oferecido nas telas de
-- parceria como opção mais leve que criar conta pra quem quer novidades
-- do missionário sem se cadastrar.
ALTER TABLE public.profiles
  ADD COLUMN whatsapp_group_url TEXT;
