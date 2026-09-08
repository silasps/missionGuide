import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteNav } from '@/components/marketing/site-nav'
import { SiteFooter } from '@/components/marketing/site-footer'

export const metadata: Metadata = {
  title: 'Termos de Uso',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  )
}

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteNav />

      <main className="flex-1 px-6 py-16 max-w-3xl mx-auto w-full space-y-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Termos de Uso</h1>
          <p className="text-sm text-muted-foreground mt-2">Última atualização: 8 de setembro de 2026</p>
        </div>

        <Section title="1. Sobre a plataforma">
          <p>
            O go→guide é uma plataforma para missionários centralizarem comunicação, gestão de parceiros e finanças
            multi-moeda com seus apoiadores. É operado pela Ostrick Systems (&quot;Ostrick&quot;, &quot;nós&quot;),
            atualmente em processo de formalização como pessoa jurídica no Brasil.
          </p>
        </Section>

        <Section title="2. Aceitação dos termos">
          <p>
            Ao criar uma conta ou usar o go→guide, você concorda com estes Termos de Uso e com a nossa{' '}
            <Link href="/privacidade" className="text-primary underline">Política de Privacidade</Link>. Se você não
            concorda, não use a plataforma.
          </p>
        </Section>

        <Section title="3. Sua conta">
          <p>
            Você precisa fornecer informações verdadeiras no cadastro e é responsável por manter suas credenciais
            de acesso em sigilo. Toda atividade realizada na sua conta é de sua responsabilidade. Avise-nos
            imediatamente se suspeitar de uso não autorizado.
          </p>
        </Section>

        <Section title="4. Uso da plataforma">
          <p>
            O go→guide oferece perfil público, publicações, gestão de parceiros, mensagens, pedidos de oração e
            um módulo financeiro. Você é responsável pelo conteúdo que publica e pelas informações que registra.
          </p>
          <p>É proibido usar a plataforma para:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Publicar conteúdo ilegal, fraudulento, difamatório ou que viole direitos de terceiros;</li>
            <li>Se passar por outra pessoa ou organização;</li>
            <li>Solicitar doações sob pretextos falsos;</li>
            <li>Tentar acessar dados de outros usuários sem autorização, ou comprometer a segurança da plataforma.</li>
          </ul>
        </Section>

        <Section title="5. Pagamentos e doações">
          <p>
            O go→guide não é uma instituição financeira e não intermedia nem retém valores doados. Nos métodos
            manuais (Pix, PayPal, transferência etc.), o pagamento acontece diretamente entre parceiro e
            missionário, fora da plataforma — o go→guide só ajuda a registrar e organizar essas ofertas. Quando
            você conecta sua própria conta via Stripe Connect, cada cobrança confirmada cai direto nela.
          </p>
          <p>
            Planos pagos (assinaturas) são cobrados recorrentemente conforme o plano escolhido, e podem ser
            cancelados a qualquer momento — o acesso aos recursos pagos permanece até o fim do período já pago.
          </p>
        </Section>

        <Section title="6. Conteúdo do usuário">
          <p>
            Você mantém a titularidade do conteúdo que publica. Ao publicá-lo na plataforma, você nos concede uma
            licença para hospedá-lo, armazená-lo e exibi-lo, na medida necessária para operar o serviço (ex.:
            mostrar seu perfil público a quem você escolher).
          </p>
        </Section>

        <Section title="7. Cancelamento e exclusão de conta">
          <p>
            Você pode excluir sua conta a qualquer momento em{' '}
            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">/conta/excluir</span>. A exclusão é
            permanente e remove seus dados pessoais, ressalvados os registros que precisamos manter por obrigação
            legal.
          </p>
        </Section>

        <Section title="8. Isenção de garantias e limitação de responsabilidade">
          <p>
            A plataforma é fornecida &quot;como está&quot;. Fazemos o possível para mantê-la disponível e segura,
            mas não garantimos operação ininterrupta ou livre de falhas. Na extensão permitida por lei, a Ostrick
            não se responsabiliza por decisões financeiras tomadas com base em dados registrados na plataforma,
            nem por perdas indiretas decorrentes do uso do serviço.
          </p>
        </Section>

        <Section title="9. Alterações nestes termos">
          <p>
            Podemos atualizar estes termos periodicamente. Mudanças relevantes serão comunicadas dentro da
            plataforma ou por e-mail. O uso continuado após uma atualização significa que você aceita os novos
            termos.
          </p>
        </Section>

        <Section title="10. Lei aplicável">
          <p>Estes termos são regidos pelas leis da República Federativa do Brasil.</p>
        </Section>

        <Section title="11. Contato">
          <p>
            Dúvidas sobre estes termos podem ser enviadas para{' '}
            <a href="mailto:ostricksystems@gmail.com" className="text-primary underline">ostricksystems@gmail.com</a>.
          </p>
        </Section>
      </main>

      <SiteFooter />
    </div>
  )
}
