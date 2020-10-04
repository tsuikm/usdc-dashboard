import { render, fireEvent } from '@testing-library/vue';
import Dashboard from "../../src/components/Dashboard.vue";
import Address from "../../src/components/Address.vue";
import Vue from "vue";
import VueMaterial from "vue-material";

Vue.use(VueMaterial);

describe("Address", () => {
    it("Wallet address displays correctly", () => {
        const { findByText } = render(Address);
        expect(findByText('0xc0539c310393165705265dc9865a0E495202771B')).not.toBeNull();
    });

    it("Displays whether the wallet address is a contract or a regular address", () => {
        const { getByText } = render(Address);
        expect(getByText("ADDRESS")).not.toBeNull();
    });
});

describe("Dashboard", () => {
    it("Address component displays on Dashboard input's submit", async () => {
        const { getByLabelText } = render(Dashboard);

        const input = getByLabelText('Wallet Address');
        await fireEvent.input(input, '0xc0539c310393165705265dc9865a0E495202771B');

        const { findByText } = render(Dashboard);

        expect(findByText('ADDRESS')).not.toBeNull();
        expect(findByText('0xc0539c310393165705265dc9865a0E495202771B')).not.toBeNull();
    });
});