import { HttpClient } from "./http-client";
import { map, Observable, tap } from "rxjs";
import { Biome } from "../model/biome.model";

export class BiomeService {
  private http: HttpClient;

  constructor() {
    this.http = new HttpClient();
  }

  getAllBiomes(): Observable<Biome[]> {
    return this.http.get<Biome[]>("/roguelands-compendium/json/biomes.json").pipe(
      tap((biomes) =>
        biomes.forEach((biome) => {
          const frequencyMap: Map<string, Map<number, number>> = new Map();

          Object.entries(biome.objects).forEach(([objectName, counts]: [string, number[]]) => {
            frequencyMap.set(
              objectName,
              counts.reduce((map, count) => {
                const existing = map.get(count);
                if (existing !== undefined) {
                  map.set(count, existing + 1);
                } else {
                  map.set(count, 1);
                }
                return map;
              }, new Map<number, number>()),
            );
            if (counts.length < biome.runs) {
              let oldMap = frequencyMap.get(objectName) ?? new Map();
              oldMap.set(0, biome.runs - counts.length);
              frequencyMap.set(objectName, oldMap);
            }
          });
          biome.frequencyMap = frequencyMap;

          biome.objects = Object.entries(biome.objects).reduce((map, [key, value]) => {
            map.set(key, value);
            return map;
          }, new Map());
        }),
      ),
    );
  }

  getAllBiomesAsMap(): Observable<Map<string, Biome>> {
    return this.getAllBiomes().pipe(
      map((allBiomes) =>
        allBiomes.reduce((map, biome) => {
          map.set(biome.name, biome);
          return map;
        }, new Map<string, Biome>()),
      ),
    );
  }
}
