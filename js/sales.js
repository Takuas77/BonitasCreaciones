// Funciones para manejar ventas
const Sales = {
    async getSales() {
        return await Storage.getSales();
    },

    async saveSale(sale) {
        return await Storage.saveSale(sale);
    },

    async deleteSale(id) {
        return await Storage.deleteSale(id);
    },

    calculateSaleStats(sales, period = 'month') {
        const now = new Date();
        const filtered = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            switch (period) {
                case 'today':
                    return saleDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return saleDate >= weekAgo;
                case 'month':
                    return saleDate.getMonth() === now.getMonth() && 
                           saleDate.getFullYear() === now.getFullYear();
                case 'year':
                    return saleDate.getFullYear() === now.getFullYear();
                default:
                    return true;
            }
        });

        const count = filtered.length;
        const revenue = filtered.reduce((sum, sale) => sum + (sale.total || 0), 0);
        const profit = filtered.reduce((sum, sale) => sum + (sale.profit || 0), 0);

        return { count, revenue, profit };
    },

    filterSales(sales, searchTerm, period) {
        let filtered = sales;

        // Filtrar por período
        if (period && period !== 'all') {
            const now = new Date();
            filtered = filtered.filter(sale => {
                const saleDate = new Date(sale.date);
                switch (period) {
                    case 'today':
                        return saleDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return saleDate >= weekAgo;
                    case 'month':
                        return saleDate.getMonth() === now.getMonth() && 
                               saleDate.getFullYear() === now.getFullYear();
                    case 'year':
                        return saleDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
        }

        // Filtrar por búsqueda
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(sale =>
                sale.product_name.toLowerCase().includes(term) ||
                (sale.customer && sale.customer.toLowerCase().includes(term))
            );
        }

        return filtered;
    }
};
