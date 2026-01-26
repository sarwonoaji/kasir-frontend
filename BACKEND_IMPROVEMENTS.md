# Backend CashierSessionController Improvements

## Perubahan yang Diperlukan

### 1. Method `open()` - Support user_id dari admin
```php
public function open(Request $request)
{
    $validated = $request->validate([
        'user_id' => 'nullable|exists:users,id', // Admin bisa specify cashier
        'shift_id' => 'required|exists:shifts,id',
        'opening_balance' => 'required|numeric|min:0',
    ]);

    $userId = $validated['user_id'] ?? Auth::id();
    $authenticatedUser = Auth::user();
    
    // Jika buka session untuk user lain, harus admin
    if ($userId !== $authenticatedUser->id && $authenticatedUser->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $activeSession = CashierSession::where('user_id', $userId)
        ->where('status', 'open')
        ->first();

    if ($activeSession) {
        return response()->json(['message' => 'Kasir sudah membuka session'], 400);
    }

    $session = CashierSession::create([
        'user_id' => $userId,
        'shift_id' => $validated['shift_id'],
        'opened_at' => now(),
        'opening_balance' => $validated['opening_balance'],
        'status' => 'open',
    ]);

    return response()->json($session, 201);
}
```

### 2. Method `close()` - Allow admin to close any session
```php
public function close(Request $request, $id)
{
    $validated = $request->validate([
        'closing_balance' => 'required|numeric|min:0',
        'notes' => 'nullable|string',
    ]);

    $session = CashierSession::findOrFail($id);
    $authenticatedUser = Auth::user();

    // Allow closing own session OR admin closing any session
    if ($session->user_id !== $authenticatedUser->id && $authenticatedUser->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $session->update([
        'closed_at' => now(),
        'closing_balance' => $validated['closing_balance'],
        'notes' => $validated['notes'] ?? null,
        'status' => 'closed',
    ]);

    return response()->json($session);
}
```

### 3. Method `activeSession()` - Support filter by user_id untuk admin
```php
public function activeSession(Request $request)
{
    $authenticatedUser = Auth::user();
    
    // Admin bisa query session kasir lain dengan user_id parameter
    if ($authenticatedUser->role === 'admin' && $request->has('user_id')) {
        $userId = $request->user_id;
    } else {
        $userId = $authenticatedUser->id;
    }

    $session = CashierSession::where('user_id', $userId)
        ->where('status', 'open')
        ->with(['shift', 'user'])
        ->first();

    return response()->json($session);
}
```

### 4. Method `history()` - Allow admin to see all sessions
```php
public function history(Request $request)
{
    $authenticatedUser = Auth::user();
    
    if ($authenticatedUser->role === 'admin') {
        // Admin bisa lihat semua sessions atau filter by user_id
        $query = CashierSession::query();
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
    } else {
        // Cashier hanya bisa lihat session mereka sendiri
        $query = CashierSession::where('user_id', $authenticatedUser->id);
    }

    $sessions = $query
        ->with(['shift', 'user'])
        ->orderBy('opened_at', 'desc')
        ->paginate(10);

    return response()->json($sessions);
}
```

## Route Endpoints

Pastikan routes sudah correct:
```php
Route::middleware('auth:api')->group(function () {
    Route::post('/cashier-sessions/open', [CashierSessionController::class, 'open']);
    Route::post('/cashier-sessions/{id}/close', [CashierSessionController::class, 'close']);
    Route::get('/cashier-sessions/current', [CashierSessionController::class, 'current']);
    Route::get('/cashier-sessions/active', [CashierSessionController::class, 'activeSession']);
    Route::get('/cashier-sessions', [CashierSessionController::class, 'history']);
});
```

## User Model

Pastikan User model punya `role` attribute:
```php
// database/migrations/xxxx_create_users_table.php
$table->enum('role', ['admin', 'cashier'])->default('cashier');

// app/Models/User.php
protected $fillable = [
    'name',
    'email',
    'password',
    'role',
];
```
