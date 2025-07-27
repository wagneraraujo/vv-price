import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
    message: "O setor de atividade deve ter pelo menos 2 caracteres",
  }),
  annual_turnover: z
    .string()
    .min(1, { message: "O faturam   ento anual deve ser maior que 0" })
    .optional(),
  lead_month: z
    .number()
    .min(1, { message: "O lead deve ser maior que 0" })
    .optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function LeadPriceForm() {



    
    const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      sector_of_activity: "",
      annual_turnover: "",
      lead_month: 10,
    },
  });

  

  const onSubmit = (data: FormSchema) => {
    console.log("data", data);
  };

  return (
    <form
      className="max-w-lg mx-auto space-y-8"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <div className="space-y-2 mt-8">
        <label
          htmlFor="countries"
          className="block mb-2 text-lg md:text-2xl font-medium text-[var(--text)] dark:text-white"
        >
          Qual o seu sector de atividade?
        </label>
        <select
          {...form.register("sector_of_activity")}
          id="field_atividade"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-lg font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-5 py-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="Formação">Formação</option>
          <option value="Cosméticos">Cosméticos</option>
          <option value="Recreativas (Dança, Yoga, Ginásio)">
            Recreativas (Dança, Yoga, Ginásio)
          </option>
          <option value="Imobiliário">Imobiliário</option>
          <option value="Veterinário">Veterinário</option>
          <option value="Telecomunicações">Telecomunicações</option>
          <option value="Dentária">Dentária</option>
          <option value="Hotelaria">Hotelaria</option>
          <option value="Decoração Interiores">Decoração Interiores</option>
          <option value="Serviços de Construção (Serralharia, Canalização, Carpintaria)">
            Serviços de Construção (Serralharia, Canalização, Carpintaria)
          </option>
          <option value="Medicina Estética">Medicina Estética</option>
          <option value="ONGs e Associações">ONGs e Associações</option>
          <option value="Consultoria">Consultoria</option>
          <option value="Seguros">Seguros</option>
          <option value="Saúde">Saúde</option>
          <option value="Automóvel">Automóvel</option>
          <option value="Consultoria Informática">
            Consultoria Informática
          </option>
          <option value="Banca">Banca</option>
          <option value="Construção">Construção</option>
          <option value="Indústria (Eólicas, Metalúrgicas, Têxtil, Cerâmicas)">
            Indústria (Eólicas, Metalúrgicas, Textil, Cerâmicas)
          </option>
          <option value="Outro">Outro</option>{" "}
        </select>
      </div>

      <div>
        <label
          htmlFor="countries"
          className="block mb-2 text-lg md:text-2xl font-medium text-[var(--text)] dark:text-white"
        >
          Qual a sua faturação anual?
        </label>
        <select
          {...form.register("annual_turnover")}
          id="annual_turnover"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="0">menos de 100K</option>
          <option value="100000">100-500K</option>
          <option value="500000">500-1M</option>
          <option value="1000000">1-5M</option>
          <option value="5000000">5-10M</option>
          <option value="10000000">mais de 10M</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="large-range"
        className="block mb-2 text-lg md:text-2xl font-medium text-[var(--text)] dark:text-white"
        >
        Quantos leads por mês você deseja?        </label>
        <input
          id="large-range"
          type="range"
          value={form.watch("lead_month") || 10}
          min="10"
          max="1000"
          onChange={(e) => {
            form.setValue("lead_month", Number(e.target.value));
          }}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700"
        />
      </div>

     
        <div className="mb-6">
          <label
            htmlFor="large-input"
           className="block mb-2 text-lg md:text-2xl font-medium text-[var(--text)] dark:text-white"
          >
            Seu nome
          </label>
          <input
            {...form.register("name")}
            type="text"
            id="large-input"
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

             
        <div className="mb-6">
          <label
            htmlFor="large-input"
           className="block mb-2 text-lg md:text-2xl font-medium text-[var(--text)] dark:text-white"
          >
            Seu email
          </label>
          <input
            {...form.register("email")}
            type="email"
            id="large-input"
            className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      

      <button   type="submit"
 className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Próximo
      </button>
    </form>
  );
}
