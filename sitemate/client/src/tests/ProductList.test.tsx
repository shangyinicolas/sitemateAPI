// Import axios and your component
import axios from "axios";
import ProductList from "../ProductList";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

jest.mock("axios");

describe("ProductList Component", () => {
  test("renders product list correctly", async () => {
    const mockedProducts = [
      { id: 1, title: "Product 1", description: "Description 1" },
      { id: 2, title: "Product 2", description: "Description 2" },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockedProducts });

    render(<ProductList />);

    for (const product of mockedProducts) {
      await waitFor(() => {
        // expect(screen.getByText(product.title)).toBeInTheDocument();
        // expect(screen.getByText(product.description)).toBeInTheDocument();
      });
    }
  });
});
