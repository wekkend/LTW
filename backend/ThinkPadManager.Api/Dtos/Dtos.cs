using System.ComponentModel.DataAnnotations;
using ThinkPadManager.Api.Models;

namespace ThinkPadManager.Api.Dtos;

// DTO = hình dạng dữ liệu nhận/gửi qua API (tách khỏi entity của database).

// Dữ liệu client gửi lên khi POST/PUT laptop.
public class LaptopInput
{
    [Required, StringLength(150, MinimumLength = 2)]
    public string Name { get; set; } = "";

    [Required]
    public string SeriesId { get; set; } = "";

    [Range(2000, 2100)]
    public int Year { get; set; }

    [Required, StringLength(50)]
    public string Cpu { get; set; } = "";

    [Range(1, 1024)]
    public int Ram { get; set; }

    [Required, StringLength(50)]
    public string Storage { get; set; } = "";

    [Required, StringLength(80)]
    public string Screen { get; set; } = "";

    [Range(0, long.MaxValue)]
    public long Price { get; set; }

    public LaptopStatus Status { get; set; } = LaptopStatus.Available;

    [StringLength(100)]
    public string Image { get; set; } = "";
}

public class ContactInput
{
    [Required, StringLength(100)]
    public string Name { get; set; } = "";

    [Required, EmailAddress, StringLength(150)]
    public string Email { get; set; } = "";

    [Required, StringLength(2000)]
    public string Message { get; set; } = "";
}

public record StatsDto(int Total, int Available, int Borrowed, int Repairing);
