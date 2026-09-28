import { notFound } from "next/navigation";
import { PropertyForm } from "@/components/admin/property-form";
import { getPropertyAdmin } from "@/lib/properties";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ created?: string; saved?: string; demo?: string }>;

export default async function EditPropertyPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const query = await searchParams;
  const property = await getPropertyAdmin(id);

  if (!property) notFound();

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow dark">Editar imóvel</p>
          <h1>{property.name}</h1>
        </div>
      </div>

      {query.created ? <div className="success-box">Imóvel cadastrado com sucesso.</div> : null}
      {query.saved ? <div className="success-box">Alterações salvas.</div> : null}
      {query.demo ? <div className="setup-box">Conecte o Supabase para salvar alterações reais.</div> : null}

      <PropertyForm property={property} />
    </>
  );
}
