import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

// Product interfeysiga `rating` ni qo'shish
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  level: string;
  image: string;
  rating: number; // Rating qo'shildi
}

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Mahsulotlarni rating bo'yicha guruhlash
  const ratings = products.reduce(
    (acc, product) => {
      if (product.rating >= 0 && product.rating < 2.5) {
        acc.low += 1;
      } else if (product.rating >= 2.5 && product.rating < 3.5) {
        acc.medium += 1;
      } else if (product.rating >= 3.5 && product.rating < 4.5) {
        acc.high += 1;
      } else if (product.rating >= 4.5 && product.rating <= 5) {
        acc.veryHigh += 1;
      }
      return acc;
    },
    { low: 0, medium: 0, high: 0, veryHigh: 0 }
  );

  // Umumiy progress qiymatlarini hisoblash
  const totalProgress = [
    {
      label: "Low Rating (0 - 2.5)",
      value: ratings.low,
      color: "error.main",
    },
    {
      label: "Medium Rating (2.5 - 3.5)",
      value: ratings.medium,
      color: "warning.main",
    },
    {
      label: "High Rating (3.5 - 4.5)",
      value: ratings.high,
      color: "info.main",
    },
    {
      label: "Very High Rating (4.5 - 5)",
      value: ratings.veryHigh,
      color: "success.main",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {totalProgress.map(progress => (
          <Grid item xs={12} md={3} key={progress.label}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <Typography variant="h6" gutterBottom>
                {progress.label}
              </Typography>
              <CircularProgress
                variant="determinate"
                value={(progress.value / products.length) * 100}
                sx={{ color: progress.color }}
              />
              <Typography variant="caption" display="block" gutterBottom>
                {progress.value} Products
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Pastki qismidagi progress */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={4}
        flexDirection="column">
        <Typography variant="h6" gutterBottom>
          Overall Progress
        </Typography>
        <CircularProgress
          variant="determinate"
          value={100}
          size={80}
          sx={{ color: "primary.main", mb: 2 }}
        />
        <Typography variant="caption" display="block" gutterBottom>
          All Products Loaded
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
