<template>
  <div>
    <Table
      :name="Accounts"
      :totalItems="this.totalItems"
      :schema="this.tableSchema"
      :content="this.transactions"
      :keyField="'Transaction Hash'"
      @page:change="this.pageChange"
      ref="table"
    />
    <Transactions :address="this.$route.params.address" />
  </div>
</template>

<script>
import Table from "@/components/Table";
export default {
  components: {
    Table,
  },
  computed: {
    totalItems() {
        // TODO: this number is hard-coded. We need to calculate the total number of transactions
        if (!this.address) return 5500;

        return this.transactions.length;
        },
        tableSchema() {
        // const transactionSchema = {
        //   "Transaction Hash": (t) => t.transactionHash,
        //   Quantity: (t) => t.data,
        //   Sender: (t) => ({
        //     value: t.from,
        //     link: `/address/${t.from}`,
        //   }),
        //   Receiver: (t) => ({
        //     value: t.to,
        //     link: `/address/${t.to}`,
        //   }),
        // };
        return [
                {
                name: "Address",
                getter(account) {
                    return account.address;
                },
                link(account) {
                    return `/address/${account.address}`;
                },
                },
                {
                name: "Balance",
                getter(account) {
                    return account.balance;
                },
                },
                {
                name: "Percentage",
                getter(account) {
                    return account.percentage;
                },
                },
            ];
            },
        pageLength() {
            return this.$refs.table.pageLength;
        },
    },
  data() {
    return {
      page: 0,
    };
  }
};
</script>
