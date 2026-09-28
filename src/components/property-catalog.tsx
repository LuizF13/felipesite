"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PropertyCard } from "@/components/property-card";
import { formatPrice, statusLabel } from "@/lib/format";
import type { Property } from "@/lib/types";

export function PropertyCatalog({ properties }: { properties: Property[] }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 180);
    return () => window.clearTimeout(timer);
  }, [query]);

  const cities = useMemo(
    () => [...new Set(properties.map((property) => property.city))].sort(),
    [properties]
  );
  const types = useMemo(
    () => [...new Set(properties.map((property) => property.property_type))].sort(),
    [properties]
  );

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return properties
      .filter((property) =>
        [property.name, property.city, property.neighborhood || ""]
          .join(" ")
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 6);
  }, [properties, query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();

    return properties.filter((property) => {
      const searchable = [
        property.name,
        property.city,
        property.neighborhood || "",
        property.property_type,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!q || searchable.includes(q)) &&
        (!city || property.city === city) &&
        (!type || property.property_type === type) &&
        (!status || property.status === status)
      );
    });
  }, [properties, debouncedQuery, city, type, status]);

  return (
    <>
      <div className="catalog-toolbar">
        <div className="property-search">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 140)}
            placeholder="Digite o nome, cidade ou bairro..."
            autoComplete="off"
          />

          {focused && suggestions.length ? (
            <div className="property-suggestions">
              {suggestions.map((property) => (
                <Link href={`/imoveis/${property.slug}`} key={property.id}>
                  <img
                    src={property.cover_image_url || "/images/property-placeholder.svg"}
                    alt=""
                  />
                  <div>
                    <strong>{property.name}</strong>
                    <span>
                      {property.city}
                      {property.neighborhood ? ` · ${property.neighborhood}` : ""}
                    </span>
                    <small>
                      {statusLabel(property.status)} ·{" "}
                      {property.status === "sold"
                        ? "Vendido"
                        : formatPrice(property.price_cents, property.price_on_request)}
                    </small>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <select value={city} onChange={(event) => setCity(event.target.value)}>
          <option value="">Todas as cidades</option>
          {cities.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="">Todos os tipos</option>
          {types.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">Todos os status</option>
          <option value="available">Disponível</option>
          <option value="reserved">Reservado</option>
          <option value="sold">Vendido</option>
        </select>
      </div>

      <div className="catalog-summary">
        <span>{filtered.length} imóvel(is) encontrado(s)</span>
        {(query || city || type || status) ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCity("");
              setType("");
              setStatus("");
            }}
          >
            Limpar filtros
          </button>
        ) : null}
      </div>

      <div className="catalog-results" key={`${debouncedQuery}-${city}-${type}-${status}`}>
        {filtered.length ? (
          <div className="property-grid">
            {filtered.map((property) => (
              <PropertyCard property={property} key={property.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            Nenhum imóvel encontrado com os filtros selecionados.
          </div>
        )}
      </div>
    </>
  );
}
