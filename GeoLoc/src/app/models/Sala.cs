using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace GeoLoc.src.app.models
{
    [Table("salas")]
    public class Sala : BaseModel
    {
        [PrimaryKey("id", false)]
        public Guid Id { get; set; }
        [Column("id_edificio")]
        public Guid IdEdificio { get; set; }
        [Column("numero")]
        public string Numero { get; set; }
        [Column("andar")]
        public int Andar { get; set; }
        [Column("nome")]
        public string Nome { get; set; }
        [Column("descricao")]
        public string Descricao { get; set; }
        [Column("latitude")]
        public double Latitude { get; set; }
        [Column("longitude")]
        public double Longitude { get; set; }
    }
}
