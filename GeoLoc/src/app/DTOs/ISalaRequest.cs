namespace GeoLoc.src.app.DTOs
{
    public class ISalaRequest
    {
        public Guid IdEdificio { get; set; }
        public string Numero { get; set; }
        public int Andar { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
