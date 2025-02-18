'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  TableMeta
} from '@tanstack/react-table';
import {

  MoreVertical,

} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import { format } from 'date-fns';
import { File } from '@/types/File';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/confirm-dialog';
import { MediaCarouselDialog } from '@/components/media-carousel-dialog';
import { useToast } from '@/components/ui/use-toast';
import { formatFileSize } from '@/components/utils/formatFileSize';
import { User } from '@/types/User';
import { deleteUser } from '@/app/api/userApi';
import { Link } from '@/types/Link';
import { deleteLinks } from '@/app/api/linkApi';

interface ExtendedTableMeta extends TableMeta<Link> {
  setData: React.Dispatch<React.SetStateAction<Link[]>>;
  router: ReturnType<typeof useRouter>;
}

export const columns: ColumnDef<Link>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'file_name',
    header: ({ column }) => <div>File Name</div>,
    cell: ({ row }) => <div className="lowercase">{row.getValue('file_name')}</div>
  },
  {
    accessorKey: 'video_type',
    header: () => <div className="">Video Type</div>,
    cell: ({ row }) => <div className="font-medium">{row.getValue('video_type')}</div>
  },
  {
    accessorKey: 'url',
    header: () => <div className="">url</div>,
    cell: ({ row }) => <div className="font-medium">{row.getValue('url')}</div>

  },
  {
    id: 'actions',
    enableHiding: false,
    header: () => <div className="">Actions</div>,
    cell: ({ row, table }) => {
      const router = (table.options.meta as ExtendedTableMeta).router;
      const setData = (table.options.meta as ExtendedTableMeta).setData;
  
      return <LinkActionsCell row={row} router={router} setData={setData} />;
    },
  }
];

const LinkActionsCell: React.FC<{
  row: any;
  router: ReturnType<typeof useRouter>;
  setData: React.Dispatch<React.SetStateAction<Link[]>>;
}> = ({ row, router, setData }) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [fileItems, setFileItems] = React.useState<File[]>([]);
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (isViewDialogOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
      }, 1000);
    }
  }, [isViewDialogOpen]);

  const handleDelete = async () => {
    try {
      await deleteLinks(row.original.id!);
      setData((prevData: Link[]) =>
        prevData.filter((item) => item.id !== row.original.id)
      );
      toast({
        title: 'Success',
        description: 'Link deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to delete link:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete link',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleEdit = () => {
    router.push(`/digital-signage/links/${row.original.id}`);
  };

  // const handleView = () => {
  //   const files = row.original.files ?? [];
  //   setFileItems(files as File[]);
  //   setViewDialogOpen(true);
  // };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem> */}
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={handleDelete}
        onClose={() => setDeleteDialogOpen(false)}
      />

      <MediaCarouselDialog
        fileItems={fileItems}
        isOpen={isViewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </>
  );
};


export function AllLinksTable({ data: initialData }: { data: Link[] }) {
  const router = useRouter();
  const [data, setData] = React.useState<Link[]>(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

    React.useEffect(() => {
      setData(initialData);
  }, [initialData]); 
  
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
    meta: {
      setData,
      router
    }
  });

  return (
    <div className="w-full">
      <div className="">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="rounded-lg border bg-white"
                  style={{
                    marginBottom: 5,
                    borderRadius: 5,
                    overflow: 'hidden'
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
