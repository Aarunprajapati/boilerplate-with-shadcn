import AppSelect, { type SelectOption } from "@/components/custom/AppSelect";
import { AutoSuggestionSearchInput } from "@/components/custom/AutoSuggestionSearchInput";
import { SearchInput } from "@/components/custom/SearchInput";
import { useState } from "react";

const DefaultDashboardLayout = () => {
  const [result, setResult] = useState<string>("");
  const [value, setValue] = useState<(string | number)[]>([]);

  const frameworks: SelectOption[] = [
    { label: "Next.js", value: 1 },
    { label: "SvelteKit", value: 2 },
    { label: "Nuxt.js", value: 3},
    { label: "Remix", value: 4 },
    { label: "Astro", value: 5 },
    { label: "helo", value: 6 },
    { label: "hii", value: 7 },
    { label: "arun", value: 8 },
    { label: "Asto", value: 9 },
  ];

  console.log(value)


  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-10">
      <h1 className="text-2xl font-semibold text-gray-800">Search Input</h1>

      <div className=" rounded-lg border p-8 w-full max-w-md space-y-6 shadow-sm">

        <div className="space-y-1">
          <p className="text-xs text-gray-400">Default</p>
          <SearchInput placeholder="Search..." onSearch={setResult}  />
        </div>

        <AutoSuggestionSearchInput variant="default" />
        <AppSelect 
          size="lg"
          options={frameworks}
          defaultValue={[1]}
          onChange={setValue}
          mode="multiple"
          placeholder="select your tech"
          maxTagCount={10}
          allowClear
          
        />

        {result && (
          <p className="text-sm text-gray-500">
            Searched:{" "}
            <span className="text-blue-500 font-medium">{result}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default DefaultDashboardLayout
