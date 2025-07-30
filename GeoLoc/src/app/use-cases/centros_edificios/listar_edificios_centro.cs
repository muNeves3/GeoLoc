using GeoLoc.src.app.models;
using GeoLoc.src.app.repositories;

namespace GeoLoc.src.app.use_cases.centros_edificios
{
    public class listar_edificios_centro
    {
        private readonly ICentroEdificioRepository _centroEdificioRepository;
        public listar_edificios_centro(ICentroEdificioRepository centroEdificioRepository)
        {
            _centroEdificioRepository = centroEdificioRepository;
        }
        public async Task<List<Centro_Edificio>> Execute(string id_centro)
        {
            if (id_centro == null)
            {
                throw new ArgumentException("ID do centro deve ser maior que zero.");
            }
            return await _centroEdificioRepository.ListarEdificiosPorCentro(id_centro);
        }
    }
}
