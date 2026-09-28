import {
  createProperty,
  deleteProperty,
  deletePropertyImage,
  setCoverImage,
  updateProperty,
} from "@/app/admin/actions";
import { formatPrice, statusLabel } from "@/lib/format";
import type { Property } from "@/lib/types";

export function PropertyForm({ property }: { property?: Property | null }) {
  const action = property
    ? updateProperty.bind(null, property.id)
    : createProperty;

  const images = property?.property_images
    ? [...property.property_images].sort(
        (a, b) => (a.position || 0) - (b.position || 0)
      )
    : [];

  return (
    <div className="admin-editor">
      <form action={action} className="admin-form">
        <div className="admin-form-main">
          <div className="admin-panel">
            <h2>Informações básicas</h2>

            <div className="admin-form-grid">
              <label className="full">
                <span>Nome do imóvel</span>
                <input name="name" required defaultValue={property?.name || ""} />
              </label>

              <label className="full">
                <span>Slug</span>
                <input
                  name="slug"
                  defaultValue={property?.slug || ""}
                  placeholder="gerado automaticamente no cadastro"
                />
              </label>

              <label>
                <span>Cidade</span>
                <input name="city" required defaultValue={property?.city || "Itapema"} />
              </label>

              <label>
                <span>Bairro</span>
                <input name="neighborhood" defaultValue={property?.neighborhood || ""} />
              </label>

              <label className="full">
                <span>Endereço / referência</span>
                <input name="address" defaultValue={property?.address || ""} />
              </label>

              <label>
                <span>Tipo</span>
                <select name="property_type" defaultValue={property?.property_type || "Apartamento"}>
                  <option>Apartamento</option>
                  <option>Cobertura</option>
                  <option>Casa</option>
                  <option>Terreno</option>
                  <option>Comercial</option>
                </select>
              </label>

              <label>
                <span>Incorporadora</span>
                <input name="developer" defaultValue={property?.developer || ""} />
              </label>

              <label>
                <span>Entrega</span>
                <input
                  name="delivery_label"
                  defaultValue={property?.delivery_label || ""}
                  placeholder="2028 / Pronto"
                />
              </label>

              <label>
                <span>Ordem no site</span>
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={property?.sort_order || 0}
                />
              </label>

              <label className="full">
                <span>Descrição</span>
                <textarea
                  name="description"
                  rows={7}
                  defaultValue={property?.description || ""}
                />
              </label>

              <label className="full">
                <span>Diferenciais separados por vírgula</span>
                <input
                  name="amenities"
                  defaultValue={(property?.amenities || []).join(", ")}
                  placeholder="Piscina, Academia, Rooftop..."
                />
              </label>
            </div>
          </div>

          <div className="admin-panel">
            <h2>Características e valores</h2>

            <div className="admin-form-grid">
              <label>
                <span>Dormitórios</span>
                <input
                  name="bedrooms"
                  type="number"
                  min="0"
                  defaultValue={property?.bedrooms || 0}
                />
              </label>

              <label>
                <span>Suítes</span>
                <input
                  name="suites"
                  type="number"
                  min="0"
                  defaultValue={property?.suites || 0}
                />
              </label>

              <label>
                <span>Banheiros</span>
                <input
                  name="bathrooms"
                  type="number"
                  min="0"
                  defaultValue={property?.bathrooms || 0}
                />
              </label>

              <label>
                <span>Vagas</span>
                <input
                  name="garages"
                  type="number"
                  min="0"
                  defaultValue={property?.garages || 0}
                />
              </label>

              <label>
                <span>Área privativa (m²)</span>
                <input
                  name="private_area"
                  inputMode="decimal"
                  defaultValue={property?.private_area ?? ""}
                />
              </label>

              <label>
                <span>Área total (m²)</span>
                <input
                  name="total_area"
                  inputMode="decimal"
                  defaultValue={property?.total_area ?? ""}
                />
              </label>

              <label className="full">
                <span>Preço em reais</span>
                <input
                  name="price_reais"
                  inputMode="decimal"
                  defaultValue={
                    property?.price_cents ? property.price_cents / 100 : ""
                  }
                  placeholder="2450000"
                />
                {property?.price_cents ? (
                  <small>
                    Atual: {formatPrice(property.price_cents, property.price_on_request)}
                  </small>
                ) : null}
              </label>

              <label className="checkbox-row full">
                <input
                  name="price_on_request"
                  type="checkbox"
                  defaultChecked={property?.price_on_request || false}
                />
                <span>Ocultar preço e mostrar “Consulte condições”</span>
              </label>
            </div>
          </div>

          <div className="admin-panel">
            <h2>Fotos e vídeo</h2>

            <div className="admin-form-grid">
              <label className="full">
                <span>Enviar novas fotos</span>
                <input name="images" type="file" accept="image/*" multiple />
                <small>
                  Você pode selecionar várias imagens. Elas serão armazenadas no Supabase Storage.
                </small>
              </label>

              <label className="full">
                <span>URL de capa manual</span>
                <input
                  name="cover_image_url"
                  defaultValue={property?.cover_image_url || ""}
                  placeholder="Opcional"
                />
              </label>

              <label className="full">
                <span>URL do vídeo</span>
                <input name="video_url" defaultValue={property?.video_url || ""} />
              </label>
            </div>
          </div>

          {property && images.length ? (
            <div className="admin-panel">
              <h2>Galeria atual</h2>
              <div className="admin-gallery">
                {images.map((image) => {
                  const coverAction = setCoverImage.bind(null, property.id, image.url);
                  const removeAction = deletePropertyImage.bind(
                    null,
                    property.id,
                    image.id || "",
                    image.storage_path || null
                  );

                  return (
                    <article key={image.id || image.url}>
                      <img src={image.url} alt={image.alt_text || property.name} />
                      <div className="admin-gallery-actions">
                        <form action={coverAction}>
                          <button className="small-button" type="submit">
                            Usar como capa
                          </button>
                        </form>
                        {image.id ? (
                          <form action={removeAction}>
                            <button className="small-button danger" type="submit">
                              Excluir
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="admin-form-side">
          <div className="admin-panel sticky-panel">
            <h2>Publicação</h2>

            <label>
              <span>Status</span>
              <select name="status" defaultValue={property?.status || "draft"}>
                <option value="available">Disponível</option>
                <option value="reserved">Reservado</option>
                <option value="sold">Vendido</option>
                <option value="unavailable">Indisponível</option>
                <option value="draft">Rascunho</option>
              </select>
              {property ? <small>Atual: {statusLabel(property.status)}</small> : null}
            </label>

            <label className="checkbox-row">
              <input
                name="is_published"
                type="checkbox"
                defaultChecked={property?.is_published || false}
              />
              <span>Mostrar no site</span>
            </label>

            <label className="checkbox-row">
              <input
                name="is_featured"
                type="checkbox"
                defaultChecked={property?.is_featured || false}
              />
              <span>Destacar na home</span>
            </label>

            <button className="button button-dark admin-save" type="submit">
              {property ? "Salvar alterações" : "Cadastrar imóvel"} →
            </button>
          </div>
        </aside>
      </form>

      {property ? (
        <form action={deleteProperty.bind(null, property.id)} className="danger-zone">
          <div>
            <strong>Excluir imóvel</strong>
            <p>Remove o imóvel e as imagens armazenadas por este cadastro.</p>
          </div>
          <button className="button button-danger" type="submit">
            Excluir
          </button>
        </form>
      ) : null}
    </div>
  );
}
