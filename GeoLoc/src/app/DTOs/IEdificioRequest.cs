namespace GeoLoc.src.app.DTOs
{
    public class IEdificioRequest
    {
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string TipoLocal { get; set; }
    }
}
