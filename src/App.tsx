import "./App.css";
import LeadPriceForm from "./components/LeadPrice";

function App() {
  return (
    <div className="min-h-screen">
      <div className="floating-elements"></div>
      
      {/* Header Section */}
      <header className="container text-center py-4 md:py-8">
        <div className="fade-in">
          <img 
            src="/logo.webp" 
            alt="VVTraffic Data Logo" 
            className="mx-auto mb-4 md:mb-6 h-12 md:h-16 w-auto"
          />
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-3 md:mb-4 leading-tight px-2">
            Descubra o <span className="bg-gradient-to-r from-blue-200 to-slate-200 bg-clip-text text-transparent">Preço Justo</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-2 font-light px-2">
            para seu investimento em Marketing Digital
          </p>
          <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed px-4">
            Evite pagar a mais e descubra qual o valor ideal de acordo com as características da sua empresa
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        <div className="max-w-4xl mx-auto">
          <LeadPriceForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="container text-center py-6 md:py-8 mt-8 md:mt-16">
        <div className="glass-effect p-4 md:p-6 max-w-2xl mx-auto">
          <p className="text-white/80 text-xs md:text-sm">
            © 2025 VVTraffic Data. Todos os direitos reservados.
          </p>
          <p className="text-white/60 text-xs mt-2">
            Calculadora de preços baseada em dados de mercado e características do seu negócio
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
