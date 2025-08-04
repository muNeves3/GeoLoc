namespace GeoLoc.src.app.repositories
{
    public interface INavegacaoService
    {
        Task<List<List<double>>> CalcularRota(double origemLat, double origemLon, Guid destinoId);
    }
}
