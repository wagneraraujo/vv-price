import { useForm } from "react-hook-form";
import { boolean, string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import calculatePrice from "../utils/calculatePrice";
import formatPrice from "../utils/formatPrice";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .optional(),
  email: z.email({ message: "O email deve ser válido" }).optional(),
  phone: z
    .string()
    .min(10, {
      message: "O número de telefone deve ter pelo menos 10 caracteres",
    })
    .optional(),
  sector_of_activity: z.string().min(2, {
    message: "Selecione um setor",
  }),
  annual_turnover: z
    .string()
    .min(1, { message: "Selecione uma base do seu faturamento anual" })
    .optional(),
  lead_month: z
    .number()
    .min(1, { message: "O lead deve ser maior que 0" })
    .optional(),
  role: string().optional(),
  city: string().optional(),
  website: string().optional(),
  socialLinks: string().optional(),
  investiment_mkt: boolean({
    message: "Selecione se já investiu em Marketing ou não",
  }),
});

type FormSchema = z.infer<typeof formSchema>;
type STEP = {
  id: number;
  title: string;
  fields: (keyof FormSchema)[];
};

const STEPS: STEP[] = [
  {
    id: 1,
    title: "Seu negócio",
    fields: ["sector_of_activity", "annual_turnover", "lead_month"],
  },
  {
    id: 2,
    title: "Informações para Contato",
    fields: ["name", "email", "phone"],
  },
  {
    id: 3,
    title: "Resultado : Valor ou média aproximado para seu investimento",
    fields: [],
  },
];

export default function LeadPriceForm() {
  const [currentStep, setCurrentStepe] = useState(1);
  const [pricePerLead, setPricePerLead] = useState(0);
  const [totalMontlyPrice, settotalMontlyPrice] = useState(0);
  const [priceBreakDown, setPriceBreakDown] = useState({
    basePrice: 0,
    turnoverMultiplayer: 1,
    volumeDiscount: 0,
    finalPrice: 0,
  });

  const [sendData, setSendData] = useState({});

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      sector_of_activity: "",
      annual_turnover: "",
      lead_month: 10,
      city: "",
      phone: "",
      role: "",
      socialLinks: "",
      website: "",
      investiment_mkt: false,
    },
  });

  const nextStep = async () => {
    const currentStepFileds = STEPS[currentStep - 1].fields;

    if (currentStepFileds.length > 0) {
      const isValid = await form.trigger(currentStepFileds);
      if (!isValid) return;
    }

    console.log("currentStep", currentStep);
    setCurrentStepe(currentStep + 1);
  };
  const backStep = () => {
    setCurrentStepe(currentStep - 1);
  };

  const watchedSector = form.watch("sector_of_activity");
  const watchedTurnover = form.watch("annual_turnover");
  const watchedLeads = form.watch("lead_month");
  console.log(priceBreakDown);

  useEffect(() => {
    if (watchedLeads && watchedSector && watchedTurnover) {
      const calculation = calculatePrice(
        watchedSector,
        watchedTurnover,
        watchedLeads,
      );

      settotalMontlyPrice(calculation.totalPrice);
      setPriceBreakDown({
        basePrice: calculation.basePrice,
        turnoverMultiplayer: calculation.priceAfterTurnover,
        finalPrice: calculation.totalPrice,
        volumeDiscount: calculation.volumeDiscount,
      });
      setPricePerLead(calculation.finalPricePerLead);
    }
  }, [watchedLeads, watchedSector, watchedTurnover]);
  const onSubmit = (data: FormSchema) => {
    const price = formatPrice(totalMontlyPrice);
    const newData = {
      mensal: price,
      name: data.name,
      email: data.email,
      sector: data.sector_of_activity,
    };

    console.log("data", JSON.stringify(newData));
    setSendData(JSON.stringify(newData));
  };

  return (
    <div className="slide-in-right">
      {/* Progress Steps */}
      <div className="flex justify-center items-center mb-6 md:mb-12 px-4">
        <div className="flex items-center space-x-2 md:space-x-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`step-indicator ${currentStep === step.id ? 'active' :
                currentStep > step.id ? 'completed' : ''
                }`}>
                {currentStep > step.id ? '✓' : step.id}
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-8 md:w-16 h-1 mx-1 md:mx-2 rounded-full ${currentStep > step.id ? 'bg-green-400' : 'bg-white/30'
                  }`}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form
        className="form-glass max-w-2xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 md:space-y-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {currentStep === 1 && (
          <div className="fade-in">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-3 px-2">
                {STEPS[currentStep - 1].title}
              </h2>
              <p className="text-gray-600 text-base md:text-lg px-2">
                Conte-nos sobre sua empresa para calcularmos o investimento ideal
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2 md:space-y-3">
                <label className="block text-base md:text-lg font-semibold text-gray-700">
                  🏙️ Em qual cidade sua empresa está localizada?
                </label>
                <input
                  type="text"
                  placeholder="Ex: Lisboa, Porto, Braga..."
                  className="input-modern w-full"
                  {...form.register("city")}
                />
              </div>
              <div className="space-y-2 md:space-y-3">
                <label className="block text-base md:text-lg font-semibold text-gray-700">
                  🏢 Qual o setor de atividade da sua empresa?
                </label>
                <select
                  {...form.register("sector_of_activity")}
                  className={`select-modern w-full ${form.formState.errors.sector_of_activity
                    ? "border-red-400 focus:border-red-500"
                    : ""
                    }`}
                >
                  <option value="">Selecione seu setor...</option>
                  <option value="Formação">📚 Formação</option>
                  <option value="Cosméticos">💄 Cosméticos</option>
                  <option value="Recreativas (Dança, Yoga, Ginásio)">
                    🏃‍♀️ Recreativas (Dança, Yoga, Ginásio)
                  </option>
                  <option value="Imobiliário">🏠 Imobiliário</option>
                  <option value="Veterinário">🐕 Veterinário</option>
                  <option value="Telecomunicações">📱 Telecomunicações</option>
                  <option value="Dentária">🦷 Dentária</option>
                  <option value="Hotelaria">🏨 Hotelaria</option>
                  <option value="Decoração Interiores">
                    🎨 Decoração Interiores
                  </option>
                  <option value="Serviços de Construção (Serralharia, Canalização, Carpintaria)">
                    🔨 Serviços de Construção
                  </option>
                  <option value="Medicina Estética">✨ Medicina Estética</option>
                  <option value="ONGs e Associações">🤝 ONGs e Associações</option>
                  <option value="Consultoria">💼 Consultoria</option>
                  <option value="Seguros">🛡️ Seguros</option>
                  <option value="Saúde">⚕️ Saúde</option>
                  <option value="Automóvel">🚗 Automóvel</option>
                  <option value="Consultoria Informática">
                    💻 Consultoria Informática
                  </option>
                  <option value="Banca">🏦 Banca</option>
                  <option value="Construção">🏗️ Construção</option>
                  <option value="Indústria (Eólicas, Metalúrgicas, Têxtil, Cerâmicas)">
                    🏭 Indústria
                  </option>
                  <option value="Outro">🔧 Outro</option>
                </select>
                {form.formState.errors.sector_of_activity && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{form.formState.errors.sector_of_activity?.message}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 md:space-y-3">
                <label className="block text-base md:text-lg font-semibold text-gray-700">
                  💰 Qual a faturação anual da sua empresa?
                </label>
                <select
                  {...form.register("annual_turnover")}
                  className="select-modern w-full"
                >
                  <option value="">Selecione a faturação...</option>
                  <option value="0">💼 Menos de 100K €</option>
                  <option value="100000">📈 100K - 500K €</option>
                  <option value="500000">🚀 500K - 1M €</option>
                  <option value="1000000">💎 1M - 5M €</option>
                  <option value="5000000">🏆 5M - 10M €</option>
                  <option value="10000000">👑 Mais de 10M €</option>
                </select>
                {form.formState.errors.annual_turnover && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{form.formState.errors.annual_turnover?.message}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 md:space-y-4">
                <label className="block text-base md:text-lg font-semibold text-gray-700">
                  🎯 Quantos leads por mês você deseja?
                </label>
                <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl border border-slate-200 shadow-lg">
                  <div className="range-container relative mb-4 md:mb-6">
                    <div
                      className="absolute top-1/2 left-0 h-2 md:h-3 bg-gradient-to-r from-blue-900 to-slate-900 rounded-full transform -translate-y-1/2 transition-all duration-300 shadow-md"
                      style={{
                        width: `${((form.watch("lead_month") || 10) - 10) / (1000 - 10) * 100}%`,
                        zIndex: 1
                      }}
                    ></div>
                    <input
                      type="range"
                      value={form.watch("lead_month") || 10}
                      min="10"
                      max="1000"
                      onChange={(e) => {
                        form.setValue("lead_month", Number(e.target.value));
                      }}
                      className="range-modern w-full relative z-10"
                      style={{ background: 'transparent' }}
                    />
                  </div>

                  <div className="flex justify-between text-xs md:text-sm font-medium text-gray-600 mb-4 md:mb-6">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-slate-400 rounded-full mr-1 md:mr-2"></span>
                      <span className="hidden sm:inline">10 leads</span>
                      <span className="sm:hidden">10</span>
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-blue-800 rounded-full mr-1 md:mr-2"></span>
                      <span className="hidden sm:inline">500 leads</span>
                      <span className="sm:hidden">500</span>
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-slate-900 rounded-full mr-1 md:mr-2"></span>
                      <span className="hidden sm:inline">1000+ leads</span>
                      <span className="sm:hidden">1000+</span>
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 md:space-x-3 bg-white px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-xl border border-gray-100">
                      <div className="text-2xl md:text-3xl animate-pulse">🎯</div>
                      <div className="text-center">
                        <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-900 to-slate-900 bg-clip-text text-transparent">
                          {form.watch("lead_month")}
                        </div>
                        <div className="text-xs md:text-sm font-medium text-gray-500">leads por mês</div>
                      </div>
                    </div>

                    <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-600">
                      {(form.watch("lead_month") || 10) <= 50 && "🌱 Crescimento inicial"}
                      {(form.watch("lead_month") || 10) > 50 && (form.watch("lead_month") || 10) <= 200 && "📈 Expansão moderada"}
                      {(form.watch("lead_month") || 10) > 200 && (form.watch("lead_month") || 10) <= 500 && "🚀 Crescimento acelerado"}
                      {(form.watch("lead_month") || 10) > 500 && "💎 Escala empresarial"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 md:space-y-3">
                <label className="block text-base md:text-lg font-semibold text-gray-700">
                  🌐 Link das suas redes sociais (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: https://instagram.com/suaempresa"
                  className="input-modern w-full"
                  {...form.register("socialLinks")}
                />
              </div>

              <div className="space-y-3 md:space-y-4">
                <label className="block text-base md:text-lg font-semibold text-gray-700">
                  📊 Você já investiu em Marketing Digital antes?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <label className="flex items-center space-x-2 md:space-x-3 bg-white p-3 md:p-4 rounded-lg md:rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition-all">
                    <input
                      {...form.register("investiment_mkt")}
                      type="radio"
                      value="true"
                      className="w-4 md:w-5 h-4 md:h-5 text-blue-600"
                    />
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <span className="text-lg md:text-2xl">✅</span>
                      <span className="font-medium text-gray-700 text-sm md:text-base">Sim, já investi</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 md:space-x-3 bg-white p-3 md:p-4 rounded-lg md:rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-300 transition-all">
                    <input
                      {...form.register("investiment_mkt")}
                      type="radio"
                      value="false"
                      className="w-4 md:w-5 h-4 md:h-5 text-blue-600"
                    />
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <span className="text-lg md:text-2xl">🆕</span>
                      <span className="font-medium text-gray-700 text-sm md:text-base">Não, é minha primeira vez</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="fade-in">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-3 px-2">
                {STEPS[currentStep - 1].title}
              </h2>
              <p className="text-gray-600 text-base md:text-lg px-2">
                Quase lá! Precisamos dos seus dados para enviar o resultado
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2 md:space-y-3">
                <label className="block text-base md:text-lg font-semibold text-gray-700">
                  👤 Qual é o seu nome?
                </label>
                <input
                  {...form.register("name")}
                  type="text"
                  placeholder="Ex: João Silva"
                  className="input-modern w-full"
                />
                {form.formState.errors.name && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{form.formState.errors.name?.message}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 md:space-y-3">
                <label className="block text-base md:text-lg font-semibold text-gray-700">
                  💼 Qual é a sua função na empresa?
                </label>
                <input
                  type="text"
                  placeholder="Ex: CEO, Diretor de Marketing, Gerente..."
                  className="input-modern w-full"
                  {...form.register("role")}
                />
              </div>

              <div className="space-y-2 md:space-y-3">
                <label className="block text-base md:text-lg font-semibold text-gray-700">
                  📧 Qual é o seu email?
                </label>
                <input
                  {...form.register("email")}
                  type="email"
                  placeholder="Ex: joao@suaempresa.com"
                  className="input-modern w-full"
                />
                {form.formState.errors.email && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{form.formState.errors.email?.message}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 md:space-y-3">
                <label className="block text-base md:text-lg font-semibold text-gray-700">
                  📱 Qual é o seu telefone?
                </label>
                <input
                  type="tel"
                  placeholder="Ex: +351 912 345 678"
                  className="input-modern w-full"
                  {...form.register("phone")}
                />
                {form.formState.errors.phone && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{form.formState.errors.phone?.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="fade-in">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-3 px-2">
                🎉 Resultado Calculado!
              </h2>
              <p className="text-gray-600 text-base md:text-lg px-2">
                Baseado nas informações da sua empresa, aqui está o investimento recomendado
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="price-card pulse-glow">
                <div className="relative z-10">
                  <div className="text-center mb-4 md:mb-6">
                    <div className="text-4xl md:text-5xl lg:text-6xl mb-3 md:mb-4">💰</div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">Investimento Mensal Recomendado</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 text-center">
                      <div className="text-xs md:text-sm font-medium mb-2 opacity-90">Valor Total Mensal</div>
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold">{formatPrice(totalMontlyPrice)}</div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-6 text-center">
                      <div className="text-xs md:text-sm font-medium mb-2 opacity-90">Preço por Lead</div>
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold">{formatPrice(pricePerLead)}</div>
                    </div>
                  </div>

                  <div className="mt-6 md:mt-8 p-4 md:p-6 bg-white/10 rounded-lg md:rounded-xl">
                    <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center">
                      <span className="text-xl md:text-2xl mr-2">📊</span>
                      Detalhamento do Cálculo
                    </h4>
                    <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                      <div className="flex justify-between">
                        <span>Preço base por setor:</span>
                        <span className="font-medium">{formatPrice(priceBreakDown.basePrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ajuste por faturamento:</span>
                        <span className="font-medium">{formatPrice(priceBreakDown.turnoverMultiplayer)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Desconto por volume:</span>
                        <span className="font-medium text-green-200">-{formatPrice(priceBreakDown.volumeDiscount)}</span>
                      </div>
                      <div className="border-t border-white/20 pt-2 md:pt-3 flex justify-between font-bold text-sm md:text-base lg:text-lg">
                        <span>Total Final:</span>
                        <span>{formatPrice(priceBreakDown.finalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-6 text-center">
                    <p className="text-xs md:text-sm opacity-90 px-2">
                      ✨ Este valor foi calculado com base no seu setor, faturamento e volume de leads desejado
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg md:rounded-xl p-4 md:p-6">
                <div className="flex items-start space-x-2 md:space-x-3">
                  <div className="text-xl md:text-2xl">💡</div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">Próximos Passos</h4>
                    <ul className="text-blue-700 text-xs md:text-sm space-y-1">
                      <li>• Nossa equipe entrará em contato em até 24 horas</li>
                      <li>• Faremos uma análise detalhada do seu negócio</li>
                      <li>• Apresentaremos uma proposta personalizada</li>
                      <li>• Definiremos a estratégia ideal para seus objetivos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 md:pt-8 border-t border-gray-200 gap-3 sm:gap-0">
          {currentStep > 1 && (
            <button
              type="button"
              className="btn-secondary w-full sm:w-auto order-2 sm:order-1"
              onClick={() => backStep()}
            >
              ← Voltar
            </button>
          )}

          {currentStep < 3 && (
            <button
              type="button"
              className={`btn-primary order-1 sm:order-2 ${currentStep === 1 ? 'w-full' : 'w-full sm:w-auto sm:ml-auto'}`}
              onClick={() => nextStep()}
            >
              {currentStep === 2 ? "🎯 Calcular Investimento" : "Continuar →"}
            </button>
          )}

          {currentStep === 3 && (
            <div className="w-full text-center">
              <button
                type="submit"
                className="btn-primary w-full sm:w-auto px-8 md:px-12 py-3 md:py-4 text-base md:text-lg"
              >
                📧 Receber Proposta Detalhada
              </button>
              <p className="text-gray-500 text-xs md:text-sm mt-2 md:mt-3 px-2">
                Clique para finalizar e receber nossa proposta personalizada
              </p>
            </div>
          )}
        </div>

        {/* Debug Info - Hidden in production */}
        {sendData && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg border-l-4 border-blue-500">
            <details className="text-sm">
              <summary className="font-semibold text-gray-700 cursor-pointer">
                📋 Dados para envio (debug)
              </summary>
              <pre className="mt-2 text-xs text-gray-600 overflow-auto">
                {sendData.toString()}
              </pre>
            </details>
          </div>
        )}
      </form>
    </div>
  );
}
