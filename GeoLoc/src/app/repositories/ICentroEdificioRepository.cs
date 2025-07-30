namespace GeoLoc.src.app.repositories
{
    public interface ICentroEdificioRepository
    {
        Task AssociarCentroEdificio(int id_centro, int id_edificio);
        Task DesassociarCentroEdificio(int id_centro, int id_edificio);
        Task<List<int>> ListarEdificiosPorCentro(int id_centro);
        Task<List<int>> ListarCentrosPorEdificio(int id_edificio);
    }
}
