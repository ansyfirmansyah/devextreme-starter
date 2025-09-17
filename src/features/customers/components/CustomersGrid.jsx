import React from 'react';
import DataGrid, { 
    Column, FilterRow, Pager, Paging, SearchPanel, Toolbar, Item
} from 'devextreme-react/data-grid';
import GridHeader from '../../../components/ui/GridHeader';
import ActionCell from '../../../components/ui/ActionCell';

const CustomersGrid = ({ customers, onAddClick, onViewClick, onEditClick, onDeleteClick }) => {
    const renderActionCell = ({ data }) => {
        return (
            <ActionCell 
                onView={() => onViewClick(data.id)}
                onEdit={() => onEditClick(data.id)}
                onDelete={() => onDeleteClick(data.id)}
            />
        );
    };

    return (
        <DataGrid
            height="100%"
            dataSource={customers}
            keyExpr="id"
            allowColumnReordering={true}
            showBorders={true}
            rowAlternationEnabled={true}
        >
            <SearchPanel visible={true} width={240} placeholder="Search..." />
            <FilterRow visible={true} />
            <Paging defaultPageSize={10} />
            <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20]} showInfo={true} />
            <GridHeader 
                title="Customers"
                buttonText="Add Customer"
                onButtonClick={onAddClick}
            />
            
            {/* dataField diubah ke camelCase */}
            <Column dataField="companyName" caption="Company Name"/>
            
            {/* Karena city adalah objek, kita perlu 'calculateCellValue' untuk menampilkan namanya */}
            <Column dataField="city" caption="City" calculateCellValue={(rowData) => rowData.city?.name}/>
            
            {/* Sama untuk province */}
            <Column dataField="province" caption="Province" calculateCellValue={(rowData) => rowData.province?.name}/>

            <Column dataField="phone"/>
            
            <Column caption="Actions" width={120} alignment="center" cellRender={renderActionCell} allowFiltering={false} allowSorting={false} />
        </DataGrid>
    );
};

export default CustomersGrid;

