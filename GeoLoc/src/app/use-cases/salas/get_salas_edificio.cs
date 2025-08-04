namespace GeoLoc.src.app.use_cases.salas
{
    public class get_salas_edificio
    {
        private readonly GeoLoc.src.app.repositories.ISalaRepository _salaRepository;

        public get_salas_edificio(GeoLoc.src.app.repositories.ISalaRepository salaRepository)
        {
            _salaRepository = salaRepository ?? throw new ArgumentNullException(nameof(salaRepository), "Sala repository cannot be null");
        }

        public async Task<List<GeoLoc.src.app.DTOs.ISalaResponse>> execute(string edificioId)
        {
            if (edificioId != null)
            {
                throw new ArgumentException("Edificio ID must be greater than zero.", nameof(edificioId));
            }
            try
            {
                return await _salaRepository.GetSalasEdificio(edificioId);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving salas for edificio ID {edificioId}: {ex.Message}", ex);
            }
        }
    }
}
