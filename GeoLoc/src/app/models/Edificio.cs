using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace GeoLoc.src.app.models
{
    [Table("edificios")]
    public class Edificio : BaseModel
    {
        [PrimaryKey("id", false)]
        public string Id { get; set; }
        [Column("nome")]
        public string Nome { get; set; }
        [Column("descricao")]
        public string Descricao { get; set; }
        [Column("latitude")]
        public double Latitude { get; set; }
        [Column("longitude")]
        public double Longitude { get; set; }
        [Column("tipo_local")]
        public string TipoLocal { get; set; }
    }
}
