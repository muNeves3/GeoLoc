using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.repositories;

namespace GeoLoc.src.app.use_cases.edificios
{
    public class create_edificio
    {
        private readonly IEdificioRepository _edificioRepository;
        public create_edificio(IEdificioRepository edificioRepository)
        {
            _edificioRepository = edificioRepository;
        }
        public async Task<IEdificioResponse> Execute(IEdificioRequest request)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request), "Request cannot be null");
            }
            return await _edificioRepository.Create(request);
        }
    }
}
