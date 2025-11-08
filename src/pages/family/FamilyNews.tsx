import { ActivityCard } from "@/components/ActivityCard";
import { GoBackButton } from "@/components/GoBackButton";
import { newsData } from "@/data/serviceData";

export function FamilyNews() {
  return (
    <div className="flex flex-col gap-6 m-3">
      <GoBackButton />

      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-3xl font-bold">Gestión de Novedades</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {newsData.map((news, index) => (
          <div className="flex flex-col">
            <ActivityCard
              key={index}
              title={news.title}
              date={""}
              description={news.description}
              photos={[]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
