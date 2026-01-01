import React from 'react';
import { Table } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';

interface TableCustomProps<T> {
  columns: any[];
  dataSource: T[];
  rowKey: string;
  loading?: boolean;
  pagination?: false | TablePaginationConfig;
}

function TableCustom<T extends { [key: string]: any }>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  pagination = undefined,
}: TableCustomProps<T>) {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      loading={loading}
      pagination={pagination}
      style={{ marginTop: 16 }}
    />
  );
}

export default TableCustom;
