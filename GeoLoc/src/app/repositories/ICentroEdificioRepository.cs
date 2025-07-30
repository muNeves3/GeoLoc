using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.models;

namespace GeoLoc.src.app.repositories
{
    public interface ICentroEdificioRepository
    {
        Task AssociarCentroEdificio(string id_centro, string id_edificio);
        Task DesassociarCentroEdificio(string id_centro, string id_edificio);
        Task<List<Centro_Edificio>> ListarEdificiosPorCentro(string id_centro);
        Task<List<Centro_Edificio>> ListarCentrosPorEdificio(string id_edificio);
    }
}
