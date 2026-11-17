using Microsoft.EntityFrameworkCore;
using ThinkPadManager.Api.Models;

namespace ThinkPadManager.Api.Data;

// DbContext = "cầu nối" giữa code C# và database. Mỗi DbSet tương ứng một bảng.
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Series> Series => Set<Series>();
    public DbSet<Laptop> Laptops => Set<Laptop>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Laptop>()
            .HasOne(l => l.Series)
            .WithMany(s => s.Laptops)
            .HasForeignKey(l => l.SeriesId)
            .OnDelete(DeleteBehavior.Restrict);   // không cho xóa dòng máy khi còn laptop

        b.Entity<Laptop>().Property(l => l.Status).HasConversion<string>().HasMaxLength(20);
        b.Entity<Laptop>().HasIndex(l => l.Name);

        // Dữ liệu mẫu (seed): được ghi vào DB khi chạy migration.
        b.Entity<Series>().HasData(
            new Series { Id = "thinkbook", Name = "ThinkBook", Code = "ThinkBook", Desc = "Dành cho doanh nghiệp vừa và nhỏ, giá dễ tiếp cận." },
            new Series { Id = "e-l", Name = "ThinkPad E - L Series", Code = "E / L", Desc = "Văn phòng phổ thông, giá tốt, đủ dùng hằng ngày." },
            new Series { Id = "x1", Name = "ThinkPad X1 Series", Code = "X1", Desc = "Cao cấp, siêu mỏng nhẹ, dòng đầu bảng của ThinkPad." },
            new Series { Id = "t", Name = "ThinkPad T Series", Code = "T", Desc = "Bền bỉ, cân bằng hiệu năng, quen thuộc với doanh nghiệp." },
            new Series { Id = "p", Name = "Workstation P Series", Code = "P", Desc = "Máy trạm mạnh cho đồ họa, dựng phim, kỹ thuật." },
            new Series { Id = "x", Name = "ThinkPad X Series", Code = "X", Desc = "Nhỏ gọn, nhẹ, phù hợp người hay di chuyển." },
            new Series { Id = "z", Name = "ThinkPad Z Series", Code = "Z", Desc = "Thiết kế sang trọng, vật liệu cao cấp." }
        );

        b.Entity<Laptop>().HasData(
            new Laptop { Id = 1, Name = "ThinkPad X1 Carbon Gen 12", SeriesId = "x1", Year = 2024, Cpu = "Core Ultra 7", Ram = 32, Storage = "1TB SSD", Screen = "14\" 2.8K OLED", Price = 52900000, Status = LaptopStatus.Available, Image = "x1-carbon.jpg" },
            new Laptop { Id = 2, Name = "ThinkPad X1 Yoga Gen 8", SeriesId = "x1", Year = 2023, Cpu = "Core i7", Ram = 16, Storage = "512GB SSD", Screen = "14\" WUXGA cảm ứng", Price = 44900000, Status = LaptopStatus.Borrowed, Image = "x1-yoga.jpg" },
            new Laptop { Id = 3, Name = "ThinkPad T14 Gen 5", SeriesId = "t", Year = 2024, Cpu = "Core Ultra 5", Ram = 16, Storage = "512GB SSD", Screen = "14\" WUXGA", Price = 29900000, Status = LaptopStatus.Available, Image = "t14.jpg" },
            new Laptop { Id = 4, Name = "ThinkPad T16 Gen 2", SeriesId = "t", Year = 2023, Cpu = "Core i7", Ram = 16, Storage = "512GB SSD", Screen = "16\" WUXGA", Price = 32500000, Status = LaptopStatus.Repairing, Image = "t16.jpg" },
            new Laptop { Id = 5, Name = "ThinkPad E14 Gen 6", SeriesId = "e-l", Year = 2025, Cpu = "Core Ultra 5", Ram = 16, Storage = "512GB SSD", Screen = "14\" WUXGA", Price = 19900000, Status = LaptopStatus.Available, Image = "e14.jpg" },
            new Laptop { Id = 6, Name = "ThinkPad L14 Gen 5", SeriesId = "e-l", Year = 2024, Cpu = "Core i5", Ram = 8, Storage = "256GB SSD", Screen = "14\" FHD", Price = 17500000, Status = LaptopStatus.Available, Image = "l14.jpg" },
            new Laptop { Id = 7, Name = "ThinkPad P1 Gen 7", SeriesId = "p", Year = 2025, Cpu = "Core Ultra 9", Ram = 64, Storage = "2TB SSD", Screen = "16\" 3.2K OLED", Price = 89900000, Status = LaptopStatus.Borrowed, Image = "p1.jpg" },
            new Laptop { Id = 8, Name = "ThinkPad P16s Gen 3", SeriesId = "p", Year = 2024, Cpu = "Core Ultra 7", Ram = 32, Storage = "1TB SSD", Screen = "16\" WUXGA", Price = 48900000, Status = LaptopStatus.Available, Image = "p16s.jpg" },
            new Laptop { Id = 9, Name = "ThinkPad X13 Gen 5", SeriesId = "x", Year = 2024, Cpu = "Core Ultra 5", Ram = 16, Storage = "512GB SSD", Screen = "13.3\" WUXGA", Price = 31900000, Status = LaptopStatus.Available, Image = "x13.jpg" },
            new Laptop { Id = 10, Name = "ThinkPad Z13 Gen 2", SeriesId = "z", Year = 2023, Cpu = "AMD Ryzen 7", Ram = 16, Storage = "512GB SSD", Screen = "13.3\" 2.8K OLED", Price = 38900000, Status = LaptopStatus.Available, Image = "z13.jpg" },
            new Laptop { Id = 11, Name = "ThinkBook 14 G7", SeriesId = "thinkbook", Year = 2025, Cpu = "Core Ultra 5", Ram = 16, Storage = "512GB SSD", Screen = "14\" WUXGA", Price = 18900000, Status = LaptopStatus.Available, Image = "thinkbook-14.jpg" },
            new Laptop { Id = 12, Name = "ThinkBook 16 G6", SeriesId = "thinkbook", Year = 2022, Cpu = "Core i5", Ram = 8, Storage = "512GB SSD", Screen = "16\" WUXGA", Price = 15900000, Status = LaptopStatus.Borrowed, Image = "thinkbook-16.jpg" }
        );
    }
}
