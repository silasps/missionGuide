import type { Metadata } from 'next'
import { SiteNav } from '@/components/marketing/site-nav'
import { SiteFooter } from '@/components/marketing/site-footer'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />

      <main className="flex-1 px-6 py-16 max-w-3xl mx-auto w-full space-y-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Política de Privacidade</h1>
          <p className="text-sm text-muted-foreground mt-2">Última atualização: 8 de setembro de 2026</p>
        </div>

        <Section title="1. Quem somos">
          <p>
            O go→guide (&quot;plataforma&quot;, &quot;nós&quot;) é operado pela Ostrick Systems (&quot;Ostrick&quot;),
            atualmente em processo de formalização como pessoa jurídica no Brasil. Até a conclusão desse processo,
            a Ostrick responde pela operação da plataforma como pessoa física.
          </p>
          <p>
            Dúvidas sobre esta política ou sobre os dados que tratamos podem ser enviadas para{' '}
            <a href="mailto:ostricksystems@gmail.com" className="text-primary underline">ostricksystems@gmail.com</a>.
          </p>
        </Section>

        <Section title="2. Quais dados coletamos">
          <p>Coletamos os dados que você mesmo fornece ao usar a plataforma, agrupados assim:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-foreground">Conta</strong>: e-mail, senha (armazenada de forma cifrada, nunca em texto puro), nome, nome de usuário, foto de perfil, telefone e data de nascimento (estes dois últimos opcionais).</li>
            <li><strong className="text-foreground">Perfil público</strong>: biografia, trajetória, projetos, publicações e mídia (fotos e vídeos) que você escolhe publicar.</li>
            <li><strong className="text-foreground">Dados financeiros</strong>: contas cadastradas no módulo Financeiro, lançamentos, categorias, chaves Pix e outros métodos de recebimento que você configura, e o histórico de ofertas/doações registradas.</li>
            <li><strong className="text-foreground">Parceiros</strong>: nome, e-mail, telefone e anotações que você cadastra sobre as pessoas que apoiam sua missão.</li>
            <li><strong className="text-foreground">Mensagens e pedidos de oração</strong>: o conteúdo é cifrado ponta a ponta (ver seção 5) — armazenamos apenas dados criptografados que não conseguimos ler.</li>
            <li><strong className="text-foreground">Dados de uso técnico</strong>: informações padrão de acesso (endereço IP, tipo de navegador, páginas visitadas) coletadas pela nossa infraestrutura de hospedagem, e um cookie de sessão que mantém você autenticado.</li>
          </ul>
        </Section>

        <Section title="3. Como usamos os seus dados">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Criar e manter sua conta, autenticar seu login e manter sua sessão.</li>
            <li>Exibir seu perfil público e conectar você aos seus parceiros/apoiadores.</li>
            <li>Processar pagamentos e assinaturas dos planos pagos, quando aplicável.</li>
            <li>Enviar notificações e e-mails transacionais (ex.: nova oferta recebida, nova mensagem, confirmação de cadastro).</li>
            <li>Fornecer o recurso de IA Copiloto, quando você opta por usá-lo (ver seção 4).</li>
            <li>Corrigir problemas técnicos e melhorar a plataforma.</li>
          </ul>
          <p>Não vendemos seus dados, e não usamos seus dados pra publicidade de terceiros.</p>
        </Section>

        <Section title="4. Com quem compartilhamos dados">
          <p>
            Usamos os seguintes prestadores de serviço pra operar a plataforma. Cada um recebe só o dado necessário
            pra função que exerce:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-foreground">Supabase</strong> — banco de dados, autenticação e armazenamento de arquivos (fotos, vídeos, documentos).</li>
            <li><strong className="text-foreground">Stripe</strong> — processamento de pagamento por cartão e, quando você conecta sua própria conta Stripe (Stripe Connect), o recebimento de doações cai direto nela — a plataforma não retém nem custodia esse dinheiro.</li>
            <li><strong className="text-foreground">Google</strong> — login via &quot;Continuar com Google&quot;, quando você escolhe essa opção.</li>
            <li><strong className="text-foreground">Brevo</strong> — envio de e-mails transacionais (notificações, confirmações).</li>
            <li><strong className="text-foreground">Anthropic (Claude)</strong> — processa o conteúdo que você envia ao recurso de IA Copiloto, só quando você usa esse recurso.</li>
            <li><strong className="text-foreground">Bunny.net</strong> — hospedagem e streaming de vídeos enviados à plataforma.</li>
            <li><strong className="text-foreground">Vercel</strong> — hospedagem da aplicação em si.</li>
          </ul>
          <p>
            Podemos também compartilhar dados se exigido por lei, ordem judicial, ou pra proteger direitos, segurança
            e propriedade da Ostrick ou de terceiros.
          </p>
        </Section>

        <Section title="5. Criptografia ponta a ponta">
          <p>
            Mensagens diretas e pedidos de oração com conteúdo sensível são protegidos por criptografia ponta a
            ponta de verdade: as chaves de cifragem/decifragem existem só no seu dispositivo (derivadas da sua
            senha de login, ou de um código de recuperação quando você entra via Google). O que fica armazenado
            nos nossos servidores é só o conteúdo já cifrado — nem a Ostrick consegue ler essas mensagens.
          </p>
        </Section>

        <Section title="6. Por quanto tempo guardamos seus dados">
          <p>
            Mantemos seus dados enquanto sua conta estiver ativa. Registros financeiros e de transações podem ser
            mantidos por período adicional quando exigido por obrigação legal ou fiscal aplicável. Ao excluir sua
            conta (seção 8), removemos os demais dados pessoais associados a ela.
          </p>
        </Section>

        <Section title="7. Seus direitos">
          <p>
            Nos termos da Lei Geral de Proteção de Dados (LGPD), você tem direito a confirmar a existência de
            tratamento, acessar seus dados, corrigi-los, solicitar anonimização, bloqueio ou eliminação de dados
            desnecessários, portabilidade, informação sobre com quem compartilhamos seus dados, e revogação do
            consentimento dado.
          </p>
        </Section>

        <Section title="8. Como exercer seus direitos">
          <p>
            A maior parte pode ser feita direto no app: edite seu perfil e dados de conta em Configurações, ou
            exclua sua conta permanentemente em{' '}
            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">/conta/excluir</span>. Pra qualquer
            outra solicitação, escreva pra{' '}
            <a href="mailto:ostricksystems@gmail.com" className="text-primary underline">ostricksystems@gmail.com</a>.
          </p>
        </Section>

        <Section title="9. Cookies">
          <p>
            Usamos um cookie de sessão (via Supabase Auth) pra manter você autenticado, e um cookie de preferência
            de idioma. Não usamos cookies de rastreamento publicitário nem ferramentas de analytics de terceiros.
          </p>
        </Section>

        <Section title="10. Transferência internacional de dados">
          <p>
            Alguns dos prestadores listados na seção 4 operam servidores fora do Brasil. Ao usar a plataforma, você
            entende que seus dados podem ser processados internacionalmente, sempre pelos provedores necessários
            pra operação do serviço.
          </p>
        </Section>

        <Section title="11. Uso por menores de idade">
          <p>A plataforma não é destinada a menores de 18 anos.</p>
        </Section>

        <Section title="12. Alterações nesta política">
          <p>
            Podemos atualizar esta política periodicamente. Mudanças relevantes serão comunicadas dentro da
            plataforma ou por e-mail.
          </p>
        </Section>
      </main>

      <SiteFooter />
    </div>
  )
}
