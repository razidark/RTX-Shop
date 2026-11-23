import { Cpu, Shield, Zap, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Nossa História</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Construindo o futuro dos e-sports, peça por peça.</p>
      </div>

      <div className="glass-panel" style={{ padding: '3rem', borderRadius: 'var(--radius-lg)', marginBottom: '4rem' }}>
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem', fontSize: '2rem' }}>A RTX Shop</h2>
        <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', lineHeight: '1.8' }}>
          Nascida em 2026, a RTX Shop surgiu da frustração de um grupo de engenheiros e pro-players com o mercado tradicional de hardware. Queríamos criar um ecossistema onde entusiastas pudessem encontrar equipamentos de nível *Enterprise* e *Enthusiast* sem burocracia.
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          Hoje, somos o maior fornecedor independente de componentes High-End da América Latina, equipando desde streamers iniciantes até centros de pesquisa de Inteligência Artificial. Nossa filosofia é simples: **Nenhum frame deixado para trás.**
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <Zap size={48} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem' }} />
          <h3 style={{ marginBottom: '1rem' }}>Alta Performance</h3>
          <p style={{ color: 'var(--text-muted)' }}>Selecionamos apenas componentes tier S. Aqui não existe gargalo.</p>
        </div>
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <Shield size={48} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem' }} />
          <h3 style={{ marginBottom: '1rem' }}>Garantia Blindada</h3>
          <p style={{ color: 'var(--text-muted)' }}>Até 5 anos de garantia nacional em peças selecionadas com RMA expresso.</p>
        </div>
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <Cpu size={48} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem' }} />
          <h3 style={{ marginBottom: '1rem' }}>Curadoria Especialista</h3>
          <p style={{ color: 'var(--text-muted)' }}>Cada peça do catálogo é testada por nossa equipe de overclocking.</p>
        </div>
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <Award size={48} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem' }} />
          <h3 style={{ marginBottom: '1rem' }}>Suporte Pro</h3>
          <p style={{ color: 'var(--text-muted)' }}>Assistência técnica composta por pessoas reais e experientes no assunto.</p>
        </div>
      </div>
    </div>
  );
}
