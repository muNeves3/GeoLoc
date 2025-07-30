using GeoLoc.src.app.repositories;

namespace GeoLoc.src.app.use_cases.centros_edificios
{
    public class listar_centro_edificio
    {
        private readonly ICentroEdificioRepository _centroEdificioRepository;
        public listar_centro_edificio(ICentroEdificioRepository centroEdificioRepository)
        {
            _centroEdificioRepository = centroEdificioRepository;
        }
        public async Task<List<int>> Execute(int id_edificio)
        {
            if (id_edificio <= 0)
            {
                throw new ArgumentException("ID do edifício deve ser maior que zero.");
            }
            return await _centroEdificioRepository.ListarCentrosPorEdificio(id_edificio);
        }
    }
}
