import './App.css'
import LeadPriceForm from './components/LeadPrice'

function App() {

  return (
    <>
      <div>
      <h1 className="text-3xl font-bold underline text-[var(--primary-color)]">
   Quanto você deseja pagar por lead?
  </h1>
      </div>

      <LeadPriceForm />
  
    </>
  )
}

export default App
