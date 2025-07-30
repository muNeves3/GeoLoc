using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.repositories;

namespace GeoLoc.src.app.use_cases.centros
{
    public class get_all_centros
    {
        private readonly ICentroRepository _centroRepository;
        public get_all_centros(ICentroRepository centroRepository)
        {
            _centroRepository = centroRepository;
        }
        public async Task<List<ICentroResponse>> execute()
        {
            try
            {
                return await _centroRepository.GetAll();
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao obter centros: {ex.Message}");
            }
        }
    }
}
