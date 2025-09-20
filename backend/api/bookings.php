<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';
$data = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        if (isset($_GET['user_id'])) {
            getUserBookings($conn, $_GET['user_id']);
        } elseif (isset($_GET['handyman_id'])) {
            getHandymanBookings($conn, $_GET['handyman_id']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Missing user_id or handyman_id']);
        }
        break;

    case 'POST':
        switch ($action) {
            case 'create':
                createBooking($conn, $data);
                break;
            case 'update_status':
                updateBookingStatus($conn, $data);
                break;
            default:
                http_response_code(400);
                echo json_encode(['error' => 'Invalid action']);
                break;
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function createBooking($conn, $data) {
    // Validate required fields
    $required = ['user_id', 'handyman_id', 'service_id', 'booking_date', 'booking_time', 'amount'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: $field"]);
            return;
        }
    }

    // Begin transaction
    $conn->begin_transaction();

    try {
        // Create booking
        $stmt = $conn->prepare("
            INSERT INTO bookings (user_id, handyman_id, service_id, booking_date, booking_time, amount)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param(
            "iiissd",
            $data['user_id'],
            $data['handyman_id'],
            $data['service_id'],
            $data['booking_date'],
            $data['booking_time'],
            $data['amount']
        );
        $stmt->execute();
        $bookingId = $stmt->insert_id;
        $stmt->close();

        $conn->commit();
        echo json_encode([
            'message' => 'Booking created successfully',
            'booking_id' => $bookingId
        ]);
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['error' => 'Booking creation failed']);
    }
}

function updateBookingStatus($conn, $data) {
    // Validate required fields
    if (!isset($data['booking_id']) || !isset($data['status'])) {
        http_response_code(400);
        echo json_encode(['error' => 'booking_id and status are required']);
        return;
    }

    // Validate status
    $validStatuses = ['accepted', 'rejected', 'in_progress', 'completed', 'cancelled'];
    if (!in_array($data['status'], $validStatuses)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid status']);
        return;
    }

    try {
        $stmt = $conn->prepare("UPDATE bookings SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $data['status'], $data['booking_id']);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo json_encode(['message' => 'Booking status updated successfully']);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Booking not found']);
        }
        $stmt->close();
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Status update failed']);
    }
}

function getUserBookings($conn, $userId) {
    $stmt = $conn->prepare("
        SELECT 
            b.*,
            s.name as service_name,
            s.category,
            u.name as handyman_name,
            u.phone as handyman_phone,
            h.current_location_lat,
            h.current_location_lng
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        JOIN handymen h ON b.handyman_id = h.id
        JOIN users u ON h.user_id = u.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
    ");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    $stmt->close();

    echo json_encode(['bookings' => $bookings]);
}

function getHandymanBookings($conn, $handymanId) {
    $stmt = $conn->prepare("
        SELECT 
            b.*,
            s.name as service_name,
            s.category,
            u.name as user_name,
            u.phone as user_phone
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        JOIN users u ON b.user_id = u.id
        WHERE b.handyman_id = ?
        ORDER BY b.created_at DESC
    ");
    $stmt->bind_param("i", $handymanId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    $stmt->close();

    echo json_encode(['bookings' => $bookings]);
}
?> 