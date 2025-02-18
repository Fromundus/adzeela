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
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  MoreVertical
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { File } from '@/types/File';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/confirm-dialog';
import { MediaCarouselDialog } from '@/components/media-carousel-dialog';
import { useToast } from '@/components/ui/use-toast';
import { deleteFile } from '@/app/api/fileApi';
import { formatFileSize } from '@/components/utils/formatFileSize';

interface ExtendedTableMeta extends TableMeta<File> {
  setData: React.Dispatch<React.SetStateAction<File[]>>;
  router: ReturnType<typeof useRouter>;
}

export const columns: ColumnDef<File>[] = [
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
    accessorKey: 'path',
    header: '',
    cell: ({ row }) => {
      const fileType = row.original.type;

      console.log('row', row.original);

      if (fileType === 'image') {
        return (
          <div className=" ">
            <img
              src={row?.original?.displayImage || ''}
              alt={row?.original?.name}
              width={100}
              height={100}
              className="rounded-lg object-cover"
            />
          </div>
        );
      } else if (fileType === 'video') {
        return (
          <div className="relative h-[150px] w-[250px] overflow-hidden rounded-lg">
            <video
              src={row?.original?.displayImage}
              className="h-full w-full object-cover"
              controls={false}
              muted
              width={100}
              height={100}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      }
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <div>Name</div>;
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('name')}</div>
  },
  {
    accessorKey: 'mime_type',
    header: () => <div className="">Type</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('mime_type')}</div>;
    }
  },
  {
    accessorKey: 'created_at',
    header: () => <div className="">Date</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue('created_at'));
      const formattedDate = format(date, 'dd/MM/yyyy');
      return <div className="font-medium">{formattedDate}</div>;
    }
  },
  {
    accessorKey: 'size',
    header: () => <div className="">Size</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {formatFileSize(row.getValue('size'))}
        </div>
      );
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    header: () => <div className="">Actions</div>,
    cell: ({ row, table }) => {
      const router = (table.options.meta as ExtendedTableMeta).router;
      const setData = (table.options.meta as ExtendedTableMeta).setData;
  
      return <ActionsCell row={row} router={router} setData={setData} />;
    },
  }
  
];

const ActionsCell: React.FC<{
  row: any;
  router: ReturnType<typeof useRouter>;
  setData: React.Dispatch<React.SetStateAction<File[]>>;
}> = ({ row, router, setData }) => {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [fileItems, setFileItems] = React.useState<File[]>([]);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteFile(row.original.id!);
      setData((prevData: File[]) =>
        prevData.filter((item) => item.id !== row.original.id)
      );
      toast({
        title: 'Success',
        description: 'File deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to delete file:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete file',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleView = () => {
    setFileItems([row.original]);
    setViewDialogOpen(true);
  };

  React.useEffect(() => {
    if (isViewDialogOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
      }, 1000);
    }
  }, [isViewDialogOpen]);

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
          <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
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


export function MediaTable({ data: initialData }: { data: File[] }) {
  const router = useRouter();
  const [data, setData] = React.useState<File[]>(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
