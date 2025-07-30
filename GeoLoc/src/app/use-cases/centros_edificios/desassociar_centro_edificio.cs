using GeoLoc.src.app.repositories;

namespace GeoLoc.src.app.use_cases.centros_edificios
{
    public class desassociar_centro_edificio
    {
        private readonly ICentroEdificioRepository _centroEdificioRepository;
        public desassociar_centro_edificio(ICentroEdificioRepository centroEdificioRepository)
        {
            _centroEdificioRepository = centroEdificioRepository;
        }
        public async Task Execute(string id_centro, string id_edificio)
        {
            if (id_centro == null || id_edificio == null)
            {
                throw new ArgumentException("IDs devem ser maiores que zero.");
            }
            await _centroEdificioRepository.DesassociarCentroEdificio(id_centro, id_edificio);
        }
    }
}
