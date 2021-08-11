# usePagination

## Usage

```js

interface IOptions {
  getRecords?: (data: any) => any[];  //默认值： data => data.items
  getTotal?: (data: any) => number;  //默认值： data => data.total
  initialParam?: any;  //默认值： { page: 1, pageSize: 10, searchValue: '' }
  paramNames?: string[];  //默认值： 无

//  records: 表格的dataSource, 
//  pagination：表格分页
//  isFetching：接口获取的状态
//  navTo：带上当前的配置参数跳往别的页面方法
//  refresh：强制刷新请求接口
//  onSearch：当上搜索关键词查询表格
//  param：当前表格状态参数：即更新后的initialParam
//  data：接口返回的数据 
const { records, pagination, isFetching, navTo, refresh, onSearch, param, data } = usePagination<string, IOptions>(
  `/audiences/tencent`,   //请求表格数据的url
  {
    getRecords: data => data.items,  //表格数据的mei 一行数据
    getTotal: data => data.total,   //数据总数
    initialParam: {
      page: 1,    //第几页
      pageSize: 10,  //每页显示多少条数据
      searchValue: '',  //搜索关键词
      paramNames: ['page', 'pageSize', 'searchValue']  //自定义配置字段名
    }
  }
);

<Table
  scroll={{ x: 100 }}
  columns={columns}
  pagination={pagination}
  dataSource={records}
  rowKey={(record) => record.id}
  loading={isFetching}
/>
```

## Example

```packages/application/src/views/select-people/index.tsx```
