# 前端页面接口

这个文档描述了 `visual-flow` 和 `工具栏` 的交互接口，文中所有接口由 `visual-flow` 提供。

## 接口内容

### SummonBlock

函数原型：`block_type => void`

`SummonBlock` 函数用于向画布中添加一个新块，`block_type` 表示要添加的块的类型。

参数类型：

- `block_type`：字符串，表示要添加的块的类型。

### SetBlockAttribute

函数原型：`attribute_name => attribute_value => void`

被修改的块被指定是当前被选中的块。

### SetBlockOnFocused

函数原型：`(attribute_list => void) => void`

当一个块被选中时，Visual-Flow 会调用设置的回调函数，从而可以在工具栏配置该方块。

### Export

函数原型：`void => export_data`

导出当前页面中的所有内容。
