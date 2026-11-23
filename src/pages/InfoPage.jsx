import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Truck, HelpCircle, FileText, Briefcase, Award, Users, Share2, HelpCircle as FaqIcon } from 'lucide-react';

const INFO_CONTENT = {
  faq: {
    icon: FaqIcon,
    title: { pt: 'Perguntas Frequentes', en: 'Frequently Asked Questions' },
    content: {
      pt: [
        { q: 'Como funciona o Montador de PC?', a: 'O nosso construtor inteligente guia você passo a passo pelos 8 componentes necessários, garantindo compatibilidade e fornecendo uma visualização em holograma 3D do seu setup.' },
        { q: 'Quais são as formas de pagamento?', a: 'Aceitamos PIX (com 15% de desconto automático), cartões de crédito Visa e Mastercard (em até 12x sem juros) e Bitcoin.' },
        { q: 'Como funciona a garantia de 3 anos?', a: 'Todos os nossos produtos novos vêm com 36 meses de garantia contra defeitos de fabricação. Caso precise, basta acionar nosso suporte pelo e-mail suporte@rtxshop.com.br.' },
        { q: 'Qual o prazo de envio?', a: 'O prazo de postagem é de até 24 horas úteis após a aprovação do pagamento. O prazo de entrega varia conforme sua região, calculável no checkout.' }
      ],
      en: [
        { q: 'How does the PC Builder work?', a: 'Our smart builder guides you step-by-step through the 8 required components, ensuring compatibility and providing a 3D hologram visualization of your setup.' },
        { q: 'What payment methods do you accept?', a: 'We accept PIX (with a 15% cash discount), Visa and Mastercard credit cards (up to 12x interest-free), and Bitcoin.' },
        { q: 'How does the 3-year warranty work?', a: 'All our new products come with a 36-month warranty against manufacturing defects. If needed, just contact our support at suporte@rtxshop.com.br.' },
        { q: 'What is the shipping time?', a: 'Handling takes up to 24 business hours after payment approval. Shipping time depends on your region, calculated at checkout.' }
      ]
    }
  },
  envio: {
    icon: Truck,
    title: { pt: 'Política de Envio', en: 'Shipping Policy' },
    content: {
      pt: [
        { q: 'Métodos de Envio', a: 'Trabalhamos com Correios (SEDEX e PAC) e transportadoras privadas parceiras (Jadlog, Azul Cargo) para entregas expressas de hardware sensível.' },
        { q: 'Seguro de Carga', a: 'Todas as nossas encomendas são enviadas com seguro total contra roubo, extravio ou danos durante o transporte, sem custo adicional para o cliente.' },
        { q: 'Rastreamento em Tempo Real', a: 'Assim que o produto for postado, você receberá um código de rastreamento no seu e-mail e poderá acompanhar o status diretamente na página de perfil.' }
      ],
      en: [
        { q: 'Shipping Methods', a: 'We work with local postal services and private express couriers (Jadlog, DHL) to ensure secure delivery of delicate computer components.' },
        { q: 'Cargo Insurance', a: 'All shipments are sent with full insurance coverage against theft, loss, or damage during transport, at no extra cost to you.' },
        { q: 'Real-Time Tracking', a: 'As soon as your package is dispatched, you will receive a tracking code via email, which you can also monitor in your Profile page.' }
      ]
    }
  },
  devolucoes: {
    icon: HelpCircle,
    title: { pt: 'Trocas e Devoluções', en: 'Returns & Exchanges' },
    content: {
      pt: [
        { q: 'Direito de Arrependimento', a: 'Você tem o direito de desistir da compra em até 7 dias corridos após o recebimento, contanto que o produto esteja na embalagem original, lacrado e sem indícios de uso.' },
        { q: 'Produtos com Defeito', a: 'Caso identifique algum problema de funcionamento dentro do prazo de garantia, você pode solicitar a troca ou reparo através do nosso processo de RMA.' },
        { q: 'Reembolsos', a: 'O estorno do valor pago será realizado no mesmo método de pagamento utilizado na compra (PIX, crédito ou Bitcoin) após o recebimento e análise do item devolvido.' }
      ],
      en: [
        { q: 'Right of Withdrawal', a: 'You have the right to withdraw from the purchase within 7 calendar days after receipt, provided the product remains in its original packaging, sealed, and unused.' },
        { q: 'Defective Products', a: 'If you identify any technical faults during the warranty period, you can request an exchange or repair through our simple RMA system.' },
        { q: 'Refunds', a: 'Refunds will be processed using the same payment method selected at checkout (PIX, credit card, or Bitcoin) after the returned item is received and inspected.' }
      ]
    }
  },
  garantia: {
    icon: Award,
    title: { pt: 'Garantia Limitada', en: 'Limited Warranty' },
    content: {
      pt: [
        { q: 'Termo de Garantia de 3 Anos', a: 'A RTX Shop assegura garantia de 3 anos (36 meses) para todos os componentes de hardware adquiridos em nossa plataforma oficial.' },
        { q: 'O que a Garantia cobre?', a: 'Defeitos funcionais de fabricação, falhas eletrônicas de chips e VRMs, e problemas de solda fria ou oxidação prematura em condições normais de uso.' },
        { q: 'O que NÃO é coberto?', a: 'Danos por queda, sobretensão elétrica residencial, tentativas de modificação de BIOS mal-sucedidas (brick) e danos físicos por manuseio inadequado no processo de montagem.' }
      ],
      en: [
        { q: '3-Year Warranty Terms', a: 'RTX Shop guarantees a 3-year (36-month) warranty for all computer hardware components purchased on our official store.' },
        { q: 'What is covered?', a: 'Manufacturing functional defects, electronic chip and VRM failures, and premature soldering faults under normal usage conditions.' },
        { q: 'What is NOT covered?', a: 'Accidental drops, residential electrical surges, failed BIOS modification attempts (bricking), and physical damage caused during custom assembly.' }
      ]
    }
  },
  termos: {
    icon: FileText,
    title: { pt: 'Termos de Serviço', en: 'Terms of Service' },
    content: {
      pt: [
        { q: 'Termos de Uso', a: 'Ao navegar ou efetuar compras na RTX Shop, você concorda com nossos termos operacionais de compra, faturamento eletrônico e entrega nacional.' },
        { q: 'Políticas de Compra', a: 'Os preços anunciados e promoções estão sujeitos a alterações de estoque. A finalização da compra no carrinho garante a reserva do lote durante o processamento do pagamento.' },
        { q: 'Uso de Cupons', a: 'Os cupons promocionais (como o RTX2026) são cumulativos apenas com o desconto padrão do PIX, a menos que especificado de outra forma em campanhas sazonais.' }
      ],
      en: [
        { q: 'Terms of Use', a: 'By browsing or shopping on RTX Shop, you agree to our operational terms of purchase, electronic invoicing, and domestic courier delivery.' },
        { q: 'Purchase Policies', a: 'Advertised prices and promotions are subject to stock availability. Completing checkout reserves your items during payment processing.' },
        { q: 'Coupon Rules', a: 'Promotional codes (such as RTX2026) are cumulative only with the standard PIX cash discount, unless specified otherwise.' }
      ]
    }
  },
  privacidade: {
    icon: Shield,
    title: { pt: 'Política de Privacidade', en: 'Privacy Policy' },
    content: {
      pt: [
        { q: 'Segurança de Dados', a: 'Seus dados de cadastro (nome, e-mail, CPF, endereço) são criptografados com certificados digitais SSL e armazenados em servidores seguros.' },
        { q: 'Não Compartilhamento', a: 'A RTX Shop compromete-se a nunca vender ou compartilhar seus dados pessoais com terceiros para fins de marketing.' },
        { q: 'Cookies e Telemetria', a: 'Utilizamos cookies locais para persistir a sua sessão, carrinho de compras e preferências de tema (modo escuro/claro) e linguagem (PT/EN).' }
      ],
      en: [
        { q: 'Data Security', a: 'Your registration data (name, email, shipping address) is encrypted using SSL digital certificates and stored in secure database clusters.' },
        { q: 'Data Sharing Policy', a: 'RTX Shop commits to never selling or sharing your personal records with third-party marketing companies.' },
        { q: 'Cookies and Session Logs', a: 'We use local cookies to persist your active login session, shopping cart contents, and layout configurations (dark/light theme and language).' }
      ]
    }
  },
  carreiras: {
    icon: Briefcase,
    title: { pt: 'Trabalhe Conosco', en: 'Careers' },
    content: {
      pt: [
        { q: 'Cultura RTX', a: 'Somos apaixonados por hardware premium, e-sports e tecnologia retro-futurista. Oferecemos um ambiente de alta flexibilidade, trabalho remoto e setups topo de linha.' },
        { q: 'Vagas Abertas', a: 'Estamos em busca de desenvolvedores Full-Stack (Vite/Node), Engenheiros de Integração de Hardware, Especialistas em Atendimento Gamer e Designers UI/UX.' },
        { q: 'Como se candidatar?', a: 'Envie seu portfólio gamer e LinkedIn para o e-mail de talentos carreiras@rtxshop.com.br.' }
      ],
      en: [
        { q: 'RTX Culture', a: 'We are passionate about high-end hardware, e-sports, and retro-futuristic styling. We offer a high-flexibility environment, remote work, and top-of-the-line gear.' },
        { q: 'Open Positions', a: 'We are looking for Full-Stack Developers (Vite/Node), Hardware Integration Engineers, Gaming Support Representatives, and UI/UX Designers.' },
        { q: 'How to apply?', a: 'Send your gaming portfolio and LinkedIn profile to our talent board: carreiras@rtxshop.com.br.' }
      ]
    }
  },
  imprensa: {
    icon: Users,
    title: { pt: 'Assessoria de Imprensa', en: 'Press Kit & Media' },
    content: {
      pt: [
        { q: 'Contato para Mídia', a: 'Se você é jornalista, criador de conteúdo ou analista de tecnologia, entre em contato através do e-mail press@rtxshop.com.br.' },
        { q: 'Materiais de Marca', a: 'Fornecemos logotipos em alta resolução, assets vetorizados de marca e fotos oficiais de nossas embalagens exclusivas sob solicitação.' },
        { q: 'Parcerias com YouTubers', a: 'Mantemos um programa de envio de hardware para análise técnica e benchmarks de performance com canais parceiros qualificados.' }
      ],
      en: [
        { q: 'Media Relations', a: 'If you are a journalist, content creator, or technology analyst, get in touch with our press team via press@rtxshop.com.br.' },
        { q: 'Brand Assets', a: 'We provide high-resolution logos, vector graphics, and official product packaging assets upon request.' },
        { q: 'Tech Reviews Partnerships', a: 'We maintain a review hardware seeding program for technical benchmarks and hardware reviews with partner channels.' }
      ]
    }
  },
  afiliados: {
    icon: Share2,
    title: { pt: 'Programa de Afiliados', en: 'Affiliates Program' },
    content: {
      pt: [
        { q: 'Como Funciona?', a: 'Cadastre-se no nosso painel de afiliados, gere seus links personalizados para peças e gabinetes e compartilhe-os no seu canal, blog ou fóruns.' },
        { q: 'Comissões Gamer', a: 'Pague comissões fixas de até 5% sobre o valor final de cada venda originada pelo seu link rastreável, com relatórios em tempo real.' },
        { q: 'Resgates', a: 'Os valores acumulados podem ser resgatados mensalmente via PIX ou Bitcoin diretamente no painel de controle financeiro do afiliado.' }
      ],
      en: [
        { q: 'How does it work?', a: 'Sign up for our affiliate program, generate custom links for components or builds, and share them on your channel, blog, or community forums.' },
        { q: 'Affiliate Commission', a: 'Get up to 5% flat commission on every sale made through your trackable link, with real-time conversion reports.' },
        { q: 'Payouts', a: 'Earned commissions can be withdrawn monthly via PIX bank transfers or Bitcoin directly inside your affiliate dashboard.' }
      ]
    }
  }
};

export default function InfoPage({ docType }) {
  const { language } = useLanguage();
  const location = useLocation();

  // If docType is not passed, resolve from the location pathname (e.g. /faq -> faq)
  const resolvedDoc = docType || location.pathname.replace(/^\//, '');
  const docData = INFO_CONTENT[resolvedDoc] || INFO_CONTENT.faq;
  const Icon = docData.icon;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', minHeight: '80vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem' }} className="builder-layout">
        
        {/* Sidebar Navigation */}
        <aside className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            {language === 'pt' ? 'Documentos e Guias' : 'Documents & Guides'}
          </h3>
          {Object.keys(INFO_CONTENT).map(key => {
            const isActive = resolvedDoc === key;
            const ItemIcon = INFO_CONTENT[key].icon;
            return (
              <Link 
                key={key} 
                to={`/${key}`}
                className="nav-link"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '0.75rem 1rem', 
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(0, 255, 136, 0.05)' : 'transparent',
                  borderColor: isActive ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                  color: isActive ? 'var(--primary-color)' : 'var(--text-muted)'
                }}
              >
                <ItemIcon size={16} />
                <span style={{ fontSize: '0.9rem', fontWeight: isActive ? '700' : '500' }}>
                  {INFO_CONTENT[key].title[language]}
                </span>
              </Link>
            );
          })}
        </aside>

        {/* Content Section */}
        <section className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(0, 255, 136, 0.08)', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
              <Icon size={28} />
            </div>
            <h1 style={{ margin: 0, fontSize: '2.2rem', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
              {docData.title[language]}
            </h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {docData.content[language].map((item, idx) => (
              <div 
                key={idx} 
                className="glass-panel" 
                style={{ 
                  padding: '2rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid rgba(255,255,255,0.04)',
                  background: 'rgba(255,255,255,0.01)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 136, 0.15)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 255, 136, 0.03)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{ margin: '0 0 0.75rem 0', color: 'var(--text-main)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--primary-color)' }}>//</span> {item.q}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1rem' }}>
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
