from typing import TypedDict, List
from db import query_db


class VarietyDict(TypedDict):
    grape_id: int
    name: str
    avg_gst: float
    comment: str
    use_direction: str
    growth_power: str
    maturation_power: str
    berry_color: str
    frost_resistance: str
    disease_resistance: str
    origin: str


class CantonDict(TypedDict):
    name: str
    code: int
    density: float
    latitude: float
    clay: float
    silt: float
    sand: float
    organic_matter: float
    pH: float
    phosphorus: float
    potassium: float
    sodium: float
    calcium_exch: float
    total_carbonates: float
    p: float
    terroir_index: float
    station_id: int
    soil_texture: str


class WeatherData(TypedDict):
    station_id: int
    name: str
    annual_precipitation: float
    gst: float
    t_sum: float
    t_min: float
    t_max: float
    moisture_fact: float


class Canton:
    @staticmethod
    def get_cantons(n: int = 211) -> List[CantonDict]:
        return query_db('SELECT * FROM Canton LIMIT ?', [n])

    @staticmethod
    def get_canton_data(code: int) -> CantonDict:
        return query_db('SELECT name, terroir_index FROM Canton WHERE code = ?', [code])[0]

    @staticmethod
    def get_index():
        data = query_db('SELECT code, terroir_index FROM Canton')
        indexes = dict()
        for item in data:
            indexes[item['code']] = str(int(item['terroir_index']))
        return indexes

    @staticmethod
    def get_names():
        names = dict()
        data = query_db('SELECT code, name FROM Canton WHERE terroir_index != -1 ORDER BY name')
        for item in data:
            names[item['code']] = item['name']
        return names

    @staticmethod
    def get_cantons_by_grape(grape_id: int):
        return query_db('SELECT distinct canton_id FROM CantonGrape where grape_id = ?', [grape_id])


class Weather:
    @staticmethod
    def get_data(code: int) -> WeatherData:
        station_id = query_db('SELECT station_id FROM Canton WHERE code = ?', [code], one=True)['station_id']
        return query_db('SELECT * FROM MeteoStation WHERE station_id = ?', [station_id], one=True)


class Grape:
    @staticmethod
    def get_grapes() -> List[VarietyDict]:
        return query_db('SELECT grape_id, name, origin FROM GrapeVariety WHERE grape_id in (select grape_id from '
                        'CantonGrape)')

    @staticmethod
    def get_grape(code: int) -> List[VarietyDict]:
        grapes = query_db('SELECT grape_id FROM CantonGrape WHERE canton_id = ?', [code])
        res = []
        for g in grapes:
            grape_id = g['grape_id']
            res.append(query_db('SELECT name, berry_color, disease_resistance, origin, use_direction FROM '
                                'GrapeVariety WHERE grape_id = ? ', [grape_id])[0])
        return res
