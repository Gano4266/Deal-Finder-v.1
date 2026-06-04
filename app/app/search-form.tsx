import Link from "next/link";
import type { Route } from "next";

type HiddenField = {
  name: string;
  value: string | number | undefined;
};

type SearchFormProps = {
  action: string;
  clearHref: string;
  hiddenFields?: HiddenField[];
  label: string;
  placeholder: string;
  query: string;
};

export function SearchForm({
  action,
  clearHref,
  hiddenFields = [],
  label,
  placeholder,
  query
}: SearchFormProps) {
  return (
    <form className="searchForm" action={action} method="get" role="search">
      {hiddenFields
        .filter((field) => field.value !== undefined && String(field.value).length > 0)
        .map((field) => (
          <input key={field.name} type="hidden" name={field.name} value={field.value} />
        ))}
      <label className="searchField">
        <span>{label}</span>
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder={placeholder}
          autoComplete="off"
        />
      </label>
      <div className="searchActions">
        <button type="submit" className="primaryLink">
          Search
        </button>
        {query ? (
          <Link href={clearHref as Route} className="secondaryLink">
            Clear
          </Link>
        ) : null}
      </div>
    </form>
  );
}
