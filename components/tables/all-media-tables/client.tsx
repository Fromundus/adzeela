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
  MoreVertical,
  FileText,
  FileImage,
  FileVideo,
  Folder
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
import { Media } from '@/types/Media';
import { File } from '@/types/File';
import { useRouter } from 'next/navigation';
import { deleteMedia } from '@/app/api/mediaApi';
import ConfirmDialog from '@/components/confirm-dialog';
import { MediaCarouselDialog } from '@/components/media-carousel-dialog';
import { useToast } from '@/components/ui/use-toast';
import { formatFileSize } from '@/components/utils/formatFileSize';

interface ExtendedTableMeta extends TableMeta<Media> {
  setData: React.Dispatch<React.SetStateAction<Media[]>>;
  router: ReturnType<typeof useRouter>;
}

export const columns: ColumnDef<Media>[] = [
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
      const files = row.original.files || [];
      const file = files[0];

      const fileUrl = file
        ? `${process.env.NEXT_PUBLIC_API_URL}/${file.path}`
        : '';
      const fileType = file ? file.type : '';

      if (files.length > 1) {
        return (
          <Image
            src="/media/images/folder.png"
            alt="Folder"
            width={30}
            height={30}
          />
        );
      } else if (fileType === 'image') {
        return (
          <div className=" ">
            <Image
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
      } else {
        return <FileText className="h-10 w-10 text-gray-500" />;
      }
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <div>Name</div>,
    cell: ({ row }) => <div className="lowercase">{row.getValue('name')}</div>
  },
  {
    accessorKey: 'type',
    header: () => <div className="">Type</div>,
    cell: ({ row }) => <div className="font-medium">{row.getValue('type')}</div>
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
    cell: ({ row }) => (
      <div className="font-medium">{formatFileSize(row.getValue('size'))}</div>
    )
  },
  {
    id: 'actions',
    enableHiding: false,
    header: () => <div className="">Actions</div>,
    cell: ({ row, table }) => {
      const router = (table.options.meta as ExtendedTableMeta).router;
      const setData = (table.options.meta as ExtendedTableMeta).setData;
  
      return <MediaActionsCell row={row} router={router} setData={setData} />;
    },
  }
];

const MediaActionsCell: React.FC<{
  row: any;
  router: ReturnType<typeof useRouter>;
  setData: React.Dispatch<React.SetStateAction<Media[]>>;
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
      await deleteMedia(row.original.id!);
      setData((prevData: Media[]) =>
        prevData.filter((item) => item.id !== row.original.id)
      );
      toast({
        title: 'Success',
        description: 'Media deleted successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to delete media:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete media',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleEdit = () => {
    router.push(`/digital-signage/media/${row.original.id}`);
  };

  const handleView = () => {
    const files = row.original.files ?? [];
    setFileItems(files as File[]);
    setViewDialogOpen(true);
  };

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


export function AllMediaTable({ data: initialData }: { data: Media[] }) {
  const router = useRouter();
  const [data, setData] = React.useState<Media[]>(initialData);
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
