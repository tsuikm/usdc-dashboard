import { render, fireEvent } from '@testing-library/vue';
import Dashboard from "../../src/components/Dashboard.vue";
import TotalSupply from "../../src/components/TotalSupply.vue";
import Vue from "vue";
import VueMaterial from "vue-material";

Vue.use(VueMaterial);

describe("TotalSupply", () => {
    it("Total supply displays correctly", () => {
        const { getByText } = render(TotalSupply);
        expect(getByText('TOTAL SUPPLY')).not.toBeNull();
        expect(getByText('TOTAL SUPPLY:')).not.toBeNull();
    });

    it("Calculates percentage of USDC held", () => {
        const { getByText } = render(TotalSupply);
        expect(getByText("PERCENTAGE OF USDC HELD")).not.toBeNull();
    });
});

describe("Dashboard", () => {
    it("Total supply displays on Dashboard input's submit", async () => {
        const { getByLabelText } = render(Dashboard);

        const input = getByLabelText('Wallet Address');
        await fireEvent.input(input, '0xc0539c310393165705265dc9865a0E495202771B');

        const { findByText } = render(Dashboard);

        expect(findByText('TOTAL SUPPLY')).not.toBeNull();
        expect(findByText('PERCENTAGE OF USDC HELD')).not.toBeNull();
        expect(findByText('<.001%')).not.toBeNull();
        expect(findByText('TOTAL SUPPLY:')).not.toBeNull();
        expect(findByText('31204993819626789 USDC')).not.toBeNull();
    });
});