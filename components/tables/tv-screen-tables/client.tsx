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
import { useRouter } from 'next/navigation'; // For Next.js App Router
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { TvScreen } from '@/types/TvScreen';
import { deleteTvScreen, registerTvScreen } from '@/app/api/tvScreenApi';
import ConfirmDialog from '@/components/confirm-dialog';
import { MediaCarouselDialog } from '@/components/media-carousel-dialog';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { File } from '@/types/File';

interface ExtendedTableMeta extends TableMeta<TvScreen> {
  setData: React.Dispatch<React.SetStateAction<TvScreen[]>>;
}

export const columns: ColumnDef<TvScreen>[] = [
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
    accessorKey: 'image',
    header: 'Preview',
    cell: ({ row }) => (
      <div className="capitalize">
        {row?.original?.playlist?.preview_type === 'image' ? (
          <img
            src={row?.original?.playlist?.preview}
            alt="placeholder"
            className="rounded-lg object-cover"
            width={100}
            height={100}
          />
        ) : (
          <video
            src={row?.original?.playlist?.preview}
            className="rounded-lg object-cover"
            width={100}
            height={100}
          />
        )}

        {/* <Image
          src={'/media/images/sidebar/adzeela-square.png'}
          alt="Adzeela"
          width={100}
          height={100}
          quality={100}
        /> */}
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <div className="lowercase">Offline</div>
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return <div>Name</div>;
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('name')}</div>
  },
  {
    accessorKey: 'address',
    header: () => <div className="">Address</div>,
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue('address')}</div>;
    }
  },
  {
    accessorKey: 'zip_code',
    header: () => <div className="">Zip Code</div>,
    cell: ({ row }) => {
      return <div className=" font-medium">{row.getValue('zip_code')}</div>;
    }
  },
  {
    accessorKey: 'playlist',
    header: () => <div className="">Playlist</div>,
    cell: ({ row }) => {
      // return <div className=" font-medium">{row.getValue('playlist')}</div>;
      return <div className="font-medium">{row?.original?.playlist?.name}</div>;
    }
  },
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
    cell: ({ row, table }) => <ActionsCell row={row} table={table} />
  }
];

// Separate ActionCell for reusability and hook safety
function ActionsCell({ row, table }: { row: any; table: any }) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [fileItems, setFileItems] = React.useState<File[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const registerTvScreenAttempt = async (id: number, url: string) => {
    console.log('id', id);
    console.log('url', url);
    // this will only happen if the user force to delete the registered device id as uuid, if this happens it will regenerate it again this use it
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('device_id', deviceId);
    }
    console.log('Device ID:', deviceId);
    try {
      await registerTvScreen(id!, deviceId);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setViewDialogOpen(false);
    }
  };
  const handleDelete = async () => {
    try {
      await deleteTvScreen(row.original.id!);
      (table.options.meta as ExtendedTableMeta).setData(
        (prevData: TvScreen[]) =>
          prevData.filter((item) => item.id !== row.original.id)
      );
      toast({
        title: 'Success',
        description: 'Tv Screen deleted successfully',
        variant: 'default'
      });
    } catch (error) {
      console.error('Failed to delete TV screen:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete tv screen',
        variant: 'destructive'
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handlePushToTvScreen = () => {
    // const files = row?.original?.playlist?.playlist_files ?? [];
    // setFileItems(files as File[]);
    // setViewDialogOpen(true);
    // console.log(row.original.id)
    // router.push(`/digital-signage/tv-screen/${row.original.id}`);
    {
      /* () => registerTvScreenAttempt(row.original.id, `/play/${row.original.playlist?.id}?orientation=${row.original.size}&tv=${row.original.id}`)} */
    }
    console.log(
      row.original.id,
      `/play/${row.original.playlist?.id}?orientation=${row.original.size}&tv=${row.original.id}`
    );
    registerTvScreenAttempt(
      row.original.id,
      `/play/${row.original.playlist?.id}?orientation=${row.original.size}&tv=${row.original.id}`
    );
  };

  const handleView = () => {
    // const files = row?.original?.playlist?.playlist_files ?? [];
    // setFileItems(files as File[]);
    // setViewDialogOpen(true);
    router.push(`/digital-signage/tv-screen/${row.original.id}`);
  };

  const handleEdit = () => {
    router.push(`/digital-signage/tv-screen/${row.original.id}`);
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
          <Link
            href={`/play/${row.original.playlist?.id}?orientation=${row.original.size}&tv=${row.original.id}`}
            target="_blank"
          >
            <DropdownMenuItem>Preview</DropdownMenuItem>
          </Link>

          {!row.original.device_id && (
            // <DropdownMenuItem onClick={() => setViewDialogOpen(true)}>
            //   Push to TV Screen {row.original.device_id }
            // </DropdownMenuItem>

            <Link
              href={`/digital-signage/tv-screen/${row.original.id}/register`}
            >
              <DropdownMenuItem>Push to TV Screen</DropdownMenuItem>
            </Link>
          )}
          {/* () => registerTvScreenAttempt(row.original.id, `/play/${row.original.playlist?.id}?orientation=${row.original.size}&tv=${row.original.id}`)} */}
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        isOpen={isDialogOpen}
        onConfirm={handleDelete}
        onClose={() => setIsDialogOpen(false)}
      />

      <ConfirmDialog
        isOpen={isViewDialogOpen}
        onConfirm={handlePushToTvScreen}
        onClose={() => setViewDialogOpen(false)}
        title="Push to TV Screen"
        message="If you push this TV Screen you will not be able to push to other browser"
        button="Push"
      />

      {/* <ConfirmDialogWithParams
        isOpen={isViewDialogOpen}
        onConfirmWithParam={handlePushToTvScreen}
        onClose={() => setViewDialogOpen(false)}
        title='Confirm pushing TV Screen'
        message='If you push this to your TV Screen, you will not be able to push to other TV browser'
        button='Push'      /> */}

      {/* <MediaCarouselDialog
        fileItems={fileItems}
        isOpen={isViewDialogOpen}
        onOpenChange={setViewDialogOpen}
        autoplay={true}
      /> */}
    </>
  );
}

export function TvScreenTable({ data: initialData }: { data: TvScreen[] }) {
  const [data, setData] = React.useState<TvScreen[]>(initialData);
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
      setData
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
