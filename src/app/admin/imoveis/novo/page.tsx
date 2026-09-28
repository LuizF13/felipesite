import { PropertyForm } from "@/components/admin/property-form";

export default function NewPropertyPage() {
  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow dark">Cadastro</p>
          <h1>Novo imóvel</h1>
        </div>
      </div>

      <PropertyForm />
    </>
  );
}
