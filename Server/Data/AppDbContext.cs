using System;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Note> Notes { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasKey(u => u.Id);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

        modelBuilder.Entity<User>()
        .HasOne(u => u.Note)
        .WithOne(n => n.User)
        .HasForeignKey<Note>(n => n.UserId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Note>()
            .HasIndex(n => n.UserId)
            .IsUnique();
    }
}
