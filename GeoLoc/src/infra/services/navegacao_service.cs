using GeoLoc.src.app.repositories;
using System.Text.Json;

namespace GeoLoc.src.infra.services
{
    public class navegacao_service : INavegacaoService
    {
        private readonly ISalaRepository _salaRepository; // Supondo que você tenha um repositório para salas
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public navegacao_service(ISalaRepository salaRepository, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _salaRepository = salaRepository;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        public async Task<List<List<double>>> CalcularRota(double origemLat, double origemLon, Guid destinoId)
        {
            // 1. Buscar as coordenadas do destino no seu banco de dados
            var salaDestino = await _salaRepository.GetByIdAsync(destinoId);
            if (salaDestino == null)
            {
                throw new Exception("Sala de destino não encontrada.");
            }
            var destinoLat = salaDestino.Latitude;
            var destinoLon = salaDestino.Longitude;

            // 2. Montar e fazer a chamada para a API do OpenRouteService
            var apiKey = _configuration["ORS_API_KEY"]; // Pega a chave das variáveis de ambiente
            var client = _httpClientFactory.CreateClient();

            // A API do ORS espera longitude,latitude
            var startCoords = $"{origemLon.ToString(System.Globalization.CultureInfo.InvariantCulture)},{origemLat.ToString(System.Globalization.CultureInfo.InvariantCulture)}";
            var endCoords = $"{destinoLon.ToString(System.Globalization.CultureInfo.InvariantCulture)},{destinoLat.ToString(System.Globalization.CultureInfo.InvariantCulture)}";

            var requestUrl = $"https://api.openrouteservice.org/v2/directions/foot-walking?api_key={apiKey}&start={startCoords}&end={endCoords}";

            var response = await client.GetAsync(requestUrl);

            if (!response.IsSuccessStatusCode)
            {
                // Lidar com erro da API externa
                return null;
            }

            // 3. Processar a resposta e extrair a rota
            var content = await response.Content.ReadAsStringAsync();
            using var jsonDoc = JsonDocument.Parse(content);

            // Extrai a geometria (a linha do caminho) da resposta JSON do ORS
            var coordinates = jsonDoc.RootElement
                .GetProperty("features")[0]
                .GetProperty("geometry")
                .GetProperty("coordinates")
                .EnumerateArray()
                .Select(point => new List<double> { point[0].GetDouble(), point[1].GetDouble() })
                .ToList();

            return coordinates;
        }
    }
}
