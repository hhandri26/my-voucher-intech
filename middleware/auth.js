export default function ({ store, redirect  }) {
    if (!store.state.authUser) {
    //   redirect('/transaksi')
      redirect({
        message: 'Anda Tidak Mempunyai Aksess',
        statusCode: 403
      })
    }
  }
  