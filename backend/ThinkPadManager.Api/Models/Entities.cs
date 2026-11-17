using System.ComponentModel.DataAnnotations;

namespace ThinkPadManager.Api.Models;

// Trạng thái máy. Lưu trong DB dạng chuỗi ("Available"), JSON trả về dạng "available".
public enum LaptopStatus
{
    Available,
    Borrowed,
    Repairing,
}

// Bảng Series: một dòng ThinkPad (x1, t, p, ...). Khóa chính là chuỗi vì URL dùng /laptops/x1.
public class Series
{
    [MaxLength(30)]
    public string Id { get; set; } = "";

    [Required, MaxLength(100)]
    public string Name { get; set; } = "";

    [Required, MaxLength(30)]
    public string Code { get; set; } = "";

    [MaxLength(300)]
    public string Desc { get; set; } = "";

    public List<Laptop> Laptops { get; set; } = [];
}

// Bảng Laptops: mỗi dòng là một máy.
public class Laptop
{
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string Name { get; set; } = "";

    [Required, MaxLength(30)]
    public string SeriesId { get; set; } = "";
    public Series? Series { get; set; }   // khóa ngoại -> Series

    public int Year { get; set; }

    [Required, MaxLength(50)]
    public string Cpu { get; set; } = "";

    public int Ram { get; set; }

    [Required, MaxLength(50)]
    public string Storage { get; set; } = "";

    [Required, MaxLength(80)]
    public string Screen { get; set; } = "";

    public long Price { get; set; }

    public LaptopStatus Status { get; set; } = LaptopStatus.Available;

    [MaxLength(100)]
    public string Image { get; set; } = "";
}

// Bảng ContactMessages: lưu tin nhắn từ form Liên hệ.
public class ContactMessage
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = "";

    [Required, MaxLength(150)]
    public string Email { get; set; } = "";

    [Required, MaxLength(2000)]
    public string Message { get; set; } = "";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
