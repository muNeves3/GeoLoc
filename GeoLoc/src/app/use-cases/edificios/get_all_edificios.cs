namespace GeoLoc.src.app.use_cases.edificios
{
    public class get_all_edificios
    {
        private readonly GeoLoc.src.app.repositories.IEdificioRepository _edificioRepository;

        public get_all_edificios(GeoLoc.src.app.repositories.IEdificioRepository edificioRepository)
        {
            _edificioRepository = edificioRepository;
        }

        public async Task<List<GeoLoc.src.app.DTOs.IEdificioResponse>> execute()
        {
            return await _edificioRepository.GetAll();
        }
    }
}
